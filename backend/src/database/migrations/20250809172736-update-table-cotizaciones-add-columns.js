'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('cotizaciones', 'tarifa_base', {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0
    });
    queryInterface.addColumn('cotizaciones', 'total_bruto', {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('cotizaciones', 'tarifa_base');
    queryInterface.removeColumn('cotizaciones', 'total_bruto');
  }
};
