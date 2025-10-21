'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('clientes', [
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        nombre: 'Empresa Logística ABC S.A.',
        contacto: 'María González - Gerente de Operaciones',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        nombre: 'Corporación de Transporte XYZ',
        contacto: 'Carlos Rodríguez - Director Comercial',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('clientes', {
      id: [
        '550e8400-e29b-41d4-a716-446655440010',
        '550e8400-e29b-41d4-a716-446655440011'
      ]
    }, {});
  }
};