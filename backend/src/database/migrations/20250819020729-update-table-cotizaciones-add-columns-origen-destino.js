'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('cotizaciones', 'origen', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn('cotizaciones', 'destino', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('cotizaciones', 'origen');
    await queryInterface.removeColumn('cotizaciones', 'destino');
  }
};
