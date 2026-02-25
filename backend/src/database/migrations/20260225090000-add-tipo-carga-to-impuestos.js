'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('impuestos', 'tipo_carga_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'tipos_carga',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Tipo de carga al que aplica el impuesto (null = aplica a todos)'
    });

    await queryInterface.addIndex('impuestos', ['tipo_carga_id']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('impuestos', 'tipo_carga_id');
  }
};
