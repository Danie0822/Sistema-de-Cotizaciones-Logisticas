'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Eliminar versión anterior del stored procedure
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS public.sp_cotizar_y_guardar(uuid, uuid, uuid, numeric, uuid);
    `);

    // Crear el stored procedure sp_cotizar_y_guardar
    await queryInterface.sequelize.query(`
    CREATE OR REPLACE FUNCTION public.sp_cotizar_y_guardar(p_cliente_id uuid, p_tipo_carga_id uuid, p_unidad_id uuid, p_peso numeric, p_origen varchar(255), p_destino varchar(255), p_descuento_id uuid DEFAULT NULL::uuid)
    RETURNS uuid
    LANGUAGE plpgsql
    AS $function$
        DECLARE
        v_precio_unitario NUMERIC(12,2);
        v_tarifa_base     NUMERIC(18,6) := 0; -- tarifa base sola
        v_total_bruto     NUMERIC(18,6) := 0; -- base + cargos antes de descuento
        v_total_neto      NUMERIC(18,6) := 0; -- después de descuento
        v_cot_id          UUID;
        r_regla           RECORD;
        v_desc_metodo     metodo_calculo_enum;
        v_desc_valor      NUMERIC(12,4);
        v_discount_amt    NUMERIC(18,6) := 0;
        v_importe         NUMERIC(18,6);
        BEGIN
        -- 1) Validar peso
        IF p_peso IS NULL OR p_peso <= 0 THEN
            RAISE EXCEPTION 'El peso debe ser mayor que cero. Valor: %', p_peso;
        END IF;

        -- 2) Tarifa base vigente
        SELECT tb.precio_unitario
            INTO v_precio_unitario
        FROM public.tarifas_base tb
        WHERE tb.deleted_at IS NULL
            AND tb.unidad_id = p_unidad_id
            AND (tb.cliente_id = p_cliente_id OR tb.cliente_id IS NULL)
            AND (tb.tipo_carga_id = p_tipo_carga_id OR tb.tipo_carga_id IS NULL)
            AND tb.vigencia_desde <= CURRENT_DATE
            AND (tb.vigencia_hasta IS NULL OR tb.vigencia_hasta >= CURRENT_DATE)
        ORDER BY
            (tb.cliente_id IS NOT NULL) DESC,
            (tb.tipo_carga_id IS NOT NULL) DESC,
            tb.vigencia_desde DESC
        LIMIT 1;

        IF v_precio_unitario IS NULL THEN
            RAISE EXCEPTION 'No hay tarifa base vigente para unidad %, cliente %, tipo de carga %',
            p_unidad_id, p_cliente_id, p_tipo_carga_id;
        END IF;

        -- 3) Calcular tarifa base y total bruto inicial
        v_tarifa_base := v_precio_unitario * p_peso;
        v_total_bruto := v_tarifa_base;

        -- 4) Crear cabecera con tarifa_base y total_bruto inicial
        INSERT INTO public.cotizaciones (
            cliente_id, tipo_carga_id, unidad_id,
            monto_total, tarifa_base, total_bruto, peso, origen, destino
        )
        VALUES (
            p_cliente_id, p_tipo_carga_id, p_unidad_id,
            0, ROUND(v_tarifa_base, 2), ROUND(v_total_bruto, 2), p_peso, p_origen, p_destino
        )
        RETURNING id INTO v_cot_id;

        -- 5) Aplicar reglas de cargo
        FOR r_regla IN
            SELECT id, peso_min, peso_max, metodo, valor
            FROM public.reglas_cargo
            WHERE deleted_at IS NULL
            AND tipo_carga_id = p_tipo_carga_id
            ORDER BY orden, id
        LOOP
            IF (r_regla.peso_min IS NULL OR p_peso >= r_regla.peso_min)
            AND (r_regla.peso_max IS NULL OR p_peso <= r_regla.peso_max) THEN

            v_importe := CASE
                WHEN r_regla.metodo = 'porcentaje'::metodo_calculo_enum
                THEN v_tarifa_base * (r_regla.valor / 100.0)
                ELSE r_regla.valor
            END;

            INSERT INTO public.cotizaciones_detalles (cotizacion_id, regla_cargo_id, monto)
            VALUES (v_cot_id, r_regla.id, ROUND(v_importe, 4));

            v_total_bruto := v_total_bruto + v_importe;
            END IF;
        END LOOP;

        -- 6) Calcular descuento sobre total_bruto
        IF p_descuento_id IS NOT NULL THEN
            SELECT metodo, valor
            INTO v_desc_metodo, v_desc_valor
            FROM public.descuentos
            WHERE id = p_descuento_id
            AND deleted_at IS NULL;

            IF NOT FOUND THEN
            RAISE EXCEPTION 'Descuento % no encontrado o inactivo', p_descuento_id;
            END IF;

            v_discount_amt := CASE
            WHEN v_desc_metodo = 'porcentaje'::metodo_calculo_enum
                THEN v_total_bruto * (v_desc_valor / 100.0)
            ELSE v_desc_valor
            END;

            IF v_discount_amt > v_total_bruto THEN
            v_discount_amt := v_total_bruto;
            END IF;

            INSERT INTO public.cotizaciones_detalles_descuento (cotizacion_id, id_descuento, monto)
            VALUES (v_cot_id, p_descuento_id, ROUND(v_discount_amt, 4));

            v_total_neto := v_total_bruto - v_discount_amt;
        ELSE
            v_total_neto := v_total_bruto;
        END IF;

        -- 7) Guardar totales finales en la cabecera
        UPDATE public.cotizaciones
            SET monto_total = ROUND(v_total_neto, 4),
                total_bruto = ROUND(v_total_bruto, 2),
                updated_at  = NOW()
        WHERE id = v_cot_id;

        RETURN v_cot_id;
        END;
        $function$
    ;



    `);
  },

  async down (queryInterface, Sequelize) {
    // Eliminar el stored procedure
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS public.sp_cotizar_y_guardar(uuid, uuid, uuid, numeric, varchar, varchar, uuid);');
  }
};
