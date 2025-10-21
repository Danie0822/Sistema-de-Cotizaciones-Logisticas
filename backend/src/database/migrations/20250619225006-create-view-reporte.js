'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Crear el stored procedure sp_cotizar_y_guardar
    await queryInterface.sequelize.query(`
    DROP VIEW IF EXISTS vw_cotizaciones_reporte_detallado;

    CREATE OR REPLACE VIEW public.vw_cotizaciones_reporte_detallado AS
    WITH cot_base AS (
        SELECT
          c.id               AS cotizacion_id,
          c.fecha_cotizacion,
          cl.nombre          AS cliente,
          tc.nombre          AS tipo_carga,
          um.codigo          AS unidad,
          c.monto_total,
          c.tarifa_base,
          c.total_bruto,
          c.peso               -- NUEVO CAMPO
        FROM cotizaciones c
        JOIN clientes cl 
          ON cl.id = c.cliente_id 
        AND cl.deleted_at IS NULL
        JOIN tipos_carga tc
          ON tc.id = c.tipo_carga_id 
        AND tc.deleted_at IS NULL
        JOIN unidades_medida um 
          ON um.id = c.unidad_id 
        AND um.deleted_at IS NULL
        WHERE c.deleted_at IS NULL
    )
    , detalles_union AS (
        -- 1) Cargos
        SELECT
          cb.cotizacion_id,
          cb.fecha_cotizacion,
          cb.cliente,
          cb.tipo_carga,
          cb.unidad,
          cb.tarifa_base,
          cb.total_bruto,
          cb.peso,  -- disponible en todas las filas
          cd.regla_cargo_id  AS concepto_id,
          rc.nombre_rubro    AS concepto,
          cd.monto           AS importe,
          'cargo'::text      AS tipo_detalle
        FROM cot_base cb
        JOIN cotizaciones_detalles cd
          ON cd.cotizacion_id = cb.cotizacion_id
        AND cd.deleted_at    IS NULL
        JOIN reglas_cargo rc
          ON rc.id = cd.regla_cargo_id
        AND rc.deleted_at    IS NULL

        UNION ALL

        -- 2) Descuentos
        SELECT
          cb.cotizacion_id,
          cb.fecha_cotizacion,
          cb.cliente,
          cb.tipo_carga,
          cb.unidad,
          cb.tarifa_base,
          cb.total_bruto,
          cb.peso,
          dd.id_descuento     AS concepto_id,
          d.nombre_descuento  AS concepto,
          dd.monto           AS importe,
          'descuento'::text   AS tipo_detalle
        FROM cot_base cb
        JOIN cotizaciones_detalles_descuento dd
          ON dd.cotizacion_id = cb.cotizacion_id
        AND dd.deleted_at    IS NULL
        JOIN descuentos d
          ON d.id = dd.id_descuento
        AND d.deleted_at     IS NULL

        UNION ALL

        -- 3) Total final
        SELECT
          cb.cotizacion_id,
          cb.fecha_cotizacion,
          cb.cliente,
          cb.tipo_carga,
          cb.unidad,
          cb.tarifa_base,
          cb.total_bruto,
          cb.peso,
          NULL::uuid                             AS concepto_id,
          'Total final'::varchar(50)             AS concepto,
          cb.monto_total                         AS importe,
          'total'::text                          AS tipo_detalle
        FROM cot_base cb
    )
    SELECT
      cotizacion_id,
      fecha_cotizacion,
      cliente,
      tipo_carga,
      unidad,
      tarifa_base,
      total_bruto,
      peso,
      concepto_id,
      concepto,
      SUM(importe)  AS importe,
      tipo_detalle
    FROM detalles_union
    GROUP BY
      cotizacion_id,
      fecha_cotizacion,
      cliente,
      tipo_carga,
      unidad,
      tarifa_base,
      total_bruto,
      peso,
      concepto_id,
      concepto,
      tipo_detalle
    ORDER BY
      cotizacion_id,
      tipo_detalle;


    `);
  },

  async down (queryInterface, Sequelize) {
    // Eliminar el stored procedure
    await queryInterface.sequelize.query('DROP VIEW IF EXISTS vw_cotizaciones_reporte_detallado;');
  }
};
