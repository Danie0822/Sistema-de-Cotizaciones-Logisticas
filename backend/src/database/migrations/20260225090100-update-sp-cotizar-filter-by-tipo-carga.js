'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Eliminar todas las versiones posibles del stored procedure
    await queryInterface.sequelize.query(`
      -- Eliminar todas las versiones anteriores
      DROP FUNCTION IF EXISTS public.sp_cotizar_y_guardar(uuid, uuid, uuid, numeric, uuid, uuid[], text, text);
      DROP FUNCTION IF EXISTS public.sp_cotizar_y_guardar(uuid, uuid, uuid, numeric, uuid, uuid[]);
      DROP FUNCTION IF EXISTS public.sp_cotizar_y_guardar(uuid, uuid, uuid, numeric, varchar, varchar, uuid);
      DROP FUNCTION IF EXISTS public.sp_cotizar_y_guardar(uuid, uuid, uuid, numeric, uuid);
      DROP FUNCTION IF EXISTS public.sp_cotizar_y_guardar();
    `);

    // Crear la nueva versión
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION public.sp_cotizar_y_guardar(
          p_cliente_id    uuid,
          p_tipo_carga_id uuid,
          p_unidad_id     uuid,
          p_peso          numeric,
          p_descuento_id  uuid DEFAULT NULL,
          p_impuestos_ids uuid[] DEFAULT NULL,
          p_origen        text DEFAULT NULL,
          p_destino       text DEFAULT NULL
      )
      RETURNS uuid
      LANGUAGE plpgsql
      AS $$
      DECLARE
          v_precio_unitario NUMERIC(12,2);
          v_tarifa_base     NUMERIC(18,6) := 0;
          v_total_bruto     NUMERIC(18,6) := 0;
          v_total_neto      NUMERIC(18,6) := 0;
          v_total_impuestos NUMERIC(18,6) := 0;
          v_monto_final     NUMERIC(18,6) := 0;
          v_cot_id          UUID;
          r_regla           RECORD;
          r_impuesto        RECORD;
          id_impuesto       UUID;
          v_desc_metodo     metodo_calculo_enum;
          v_desc_valor      NUMERIC(12,4);
          v_discount_amt    NUMERIC(18,6) := 0;
          v_importe         NUMERIC(18,6);
          v_base_impuesto   NUMERIC(18,6);
          v_monto_impuesto  NUMERIC(18,6);
      BEGIN
          -- 1) Validar peso
          IF p_peso IS NULL OR p_peso <= 0 THEN
              RAISE EXCEPTION 'El peso debe ser mayor que cero. Valor: %', p_peso;
          END IF;

          -- 2) Obtener tarifa base vigente
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

          -- 3) Calcular tarifa base
          v_tarifa_base := v_precio_unitario * p_peso;
          v_total_bruto := v_tarifa_base;

          -- 4) Crear cotización
          INSERT INTO public.cotizaciones (
              cliente_id, tipo_carga_id, unidad_id,
              monto_sin_impuestos, tarifa_base, total_bruto, peso,
              monto_total_con_impuestos, origen, destino, fecha_cotizacion
          )
          VALUES (
              p_cliente_id, p_tipo_carga_id, p_unidad_id,
              0, ROUND(v_tarifa_base, 2), ROUND(v_total_bruto, 2), p_peso, 
              0, p_origen, p_destino, NOW()
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

          -- 6) Calcular descuento
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

          -- 7) Aplicar impuestos
          IF p_impuestos_ids IS NOT NULL AND array_length(p_impuestos_ids, 1) > 0 THEN
              FOREACH id_impuesto IN ARRAY p_impuestos_ids
              LOOP
                  SELECT imp.tipo, imp.valor, imp.aplicable_a, imp.es_acumulativo
                  INTO r_impuesto
                  FROM public.impuestos imp
                  WHERE imp.id = id_impuesto
                  AND imp.deleted_at IS NULL
                  AND imp.activo = true
                  AND imp.vigencia_desde <= CURRENT_DATE
                  AND (imp.vigencia_hasta IS NULL OR imp.vigencia_hasta >= CURRENT_DATE)
                  AND (imp.tipo_carga_id IS NULL OR imp.tipo_carga_id = p_tipo_carga_id);

                  IF NOT FOUND THEN
                      CONTINUE;
                  END IF;

                  -- Determinar base de cálculo del impuesto
                  v_base_impuesto := CASE r_impuesto.aplicable_a
                      WHEN 'tarifa_base' THEN v_tarifa_base
                      WHEN 'total_bruto' THEN v_total_bruto
                      WHEN 'subtotal_neto' THEN v_total_neto
                      ELSE v_total_neto
                  END;

                  -- Si es acumulativo, sumar impuestos anteriores
                  IF r_impuesto.es_acumulativo THEN
                      v_base_impuesto := v_base_impuesto + v_total_impuestos;
                  END IF;

                  -- Calcular monto del impuesto
                  v_monto_impuesto := CASE r_impuesto.tipo
                      WHEN 'porcentaje'::metodo_calculo_enum
                      THEN v_base_impuesto * (r_impuesto.valor / 100.0)
                      ELSE r_impuesto.valor
                  END;

                  -- Guardar detalle de impuesto
                  INSERT INTO public.cotizaciones_detalles_impuestos 
                      (cotizacion_id, impuesto_id, base_calculo, porcentaje_aplicado, monto)
                  VALUES (
                      v_cot_id, 
                      id_impuesto,
                      v_base_impuesto,
                      CASE WHEN r_impuesto.tipo = 'porcentaje'::metodo_calculo_enum 
                           THEN r_impuesto.valor ELSE NULL END,
                      ROUND(v_monto_impuesto, 4)
                  );

                  v_total_impuestos := v_total_impuestos + v_monto_impuesto;
              END LOOP;
          END IF;

          -- 8) Calcular total final
          v_monto_final := v_total_neto + v_total_impuestos;

          -- 9) Actualizar cotización con totales finales
          UPDATE public.cotizaciones
              SET monto_sin_impuestos = ROUND(v_total_neto, 4),
                  total_neto = ROUND(v_total_neto, 2),
                  total_bruto = ROUND(v_total_bruto, 2),
                  monto_impuestos = ROUND(v_total_impuestos, 4),
                  monto_total_con_impuestos = ROUND(v_monto_final, 4),
                  updated_at = NOW()
          WHERE id = v_cot_id;

          RETURN v_cot_id;
      END;
      $$;
    `);
  },

  async down (queryInterface, Sequelize) {
    // En down, eliminamos todas las versiones
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS public.sp_cotizar_y_guardar(uuid, uuid, uuid, numeric, uuid, uuid[], text, text);
      DROP FUNCTION IF EXISTS public.sp_cotizar_y_guardar(uuid, uuid, uuid, numeric, uuid, uuid[]);
      DROP FUNCTION IF EXISTS public.sp_cotizar_y_guardar(uuid, uuid, uuid, numeric, varchar, varchar, uuid);
      DROP FUNCTION IF EXISTS public.sp_cotizar_y_guardar(uuid, uuid, uuid, numeric, uuid);
    `);
  }
};
