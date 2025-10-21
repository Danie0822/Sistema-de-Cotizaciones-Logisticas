'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tarifas_base', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      cliente_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'clientes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      tipo_carga_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'tipos_carga',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', 
        comment: 'Tipo de carga asociado a la tarifa base pero puede ser nulo, si es nula se aplica a todos los tipos de carga'
      },
      unidad_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'unidades_medida',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      precio_unitario: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      vigencia_desde: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      vigencia_hasta: {
        type: Sequelize.DATEONLY,
        allowNull: true
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

    // Agregar constraint única
    await queryInterface.addConstraint('tarifas_base', {
      fields: ['cliente_id', 'tipo_carga_id', 'unidad_id'],
      type: 'unique',
      name: 'tarifa_unica_por_cliente_tipo'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tarifas_base');
  }
};
