'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Renombrar columna monto_total a monto_sin_impuestos
    await queryInterface.renameColumn('cotizaciones', 'monto_total', 'monto_sin_impuestos');

    // Agregar nuevas columnas
    await queryInterface.addColumn('cotizaciones', 'total_neto', {
      type: Sequelize.DECIMAL(14, 4),
      allowNull: true,
      defaultValue: null,
      comment: 'Total después de descuentos y antes de impuestos'
    });

    await queryInterface.addColumn('cotizaciones', 'monto_impuestos', {
      type: Sequelize.DECIMAL(14, 4),
      defaultValue: 0,
      comment: 'Suma de todos los impuestos aplicados'
    });

    await queryInterface.addColumn('cotizaciones', 'monto_total_con_impuestos', {
      type: Sequelize.DECIMAL(14, 4),
      allowNull: false,
      defaultValue: 0,
      comment: 'Monto total incluyendo impuestos'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('cotizaciones', 'total_neto');
    await queryInterface.removeColumn('cotizaciones', 'monto_impuestos');
    await queryInterface.removeColumn('cotizaciones', 'monto_total_con_impuestos');
    await queryInterface.renameColumn('cotizaciones', 'monto_sin_impuestos', 'monto_total');
  }
};
