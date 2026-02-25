'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('impuestos', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      codigo: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        comment: 'Ej: IVA, IMPUESTO_MUNICIPAL, etc'
      },
      tipo: {
        type: Sequelize.ENUM('porcentaje', 'monto_fijo'),
        allowNull: false
      },
      valor: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      aplicable_a: {
        type: Sequelize.ENUM('subtotal_neto', 'total_bruto', 'tarifa_base'),
        allowNull: false,
        defaultValue: 'subtotal_neto',
        comment: 'Base sobre la cual se calcula el impuesto'
      },
      es_acumulativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Si otros impuestos se calculan sobre este'
      },
      vigencia_desde: {
        type: Sequelize.DATE,
        allowNull: false
      },
      vigencia_hasta: {
        type: Sequelize.DATE,
        allowNull: true
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('impuestos', ['codigo']);
    await queryInterface.addIndex('impuestos', ['activo']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('impuestos');
  }
};
