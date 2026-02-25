'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cotizaciones_detalles_impuestos', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      cotizacion_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cotizaciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      impuesto_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'impuestos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      base_calculo: {
        type: Sequelize.DECIMAL(14, 4),
        allowNull: false,
        comment: 'Monto sobre el cual se calculó el impuesto'
      },
      porcentaje_aplicado: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      monto: {
        type: Sequelize.DECIMAL(14, 4),
        allowNull: false
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
      }
    });

    await queryInterface.addIndex('cotizaciones_detalles_impuestos', ['cotizacion_id']);
    await queryInterface.addIndex('cotizaciones_detalles_impuestos', ['impuesto_id']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cotizaciones_detalles_impuestos');
  }
};
