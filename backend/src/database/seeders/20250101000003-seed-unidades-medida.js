'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('unidades_medida', [
      {
        id: '550e8400-e29b-41d4-a716-446655440020',
        codigo: 'KG',
        descripcion: 'Kilogramos',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440021',
        codigo: 'TON',
        descripcion: 'Toneladas',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('unidades_medida', {
      id: [
        '550e8400-e29b-41d4-a716-446655440020',
        '550e8400-e29b-41d4-a716-446655440021'
      ]
    }, {});
  }
};