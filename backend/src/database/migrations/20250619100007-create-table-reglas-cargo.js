'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('reglas_cargo', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()')
            },
            tipo_carga_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'tipos_carga',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            nombre_rubro: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            peso_min: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true,
                defaultValue: 0
            },
            peso_max: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true
            },
            metodo: {
                type: 'metodo_calculo_enum',
                allowNull: false,
                comment: 'Define el método de cálculo para el cargo, como porcentaje o monto fijo'
            },
            valor: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false
            },
            orden: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
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

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('reglas_cargo');
    }
};
