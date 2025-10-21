'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cotizaciones_detalles_descuento', {
      cotizacion_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cotizaciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true
      },
      id_descuento: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'descuentos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        primaryKey: true
      },
      monto: {
        type: Sequelize.DECIMAL(12, 4),
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
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cotizaciones_detalles_descuento');
  }
};
