'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tipos_carga', [
      {
        id: '550e8400-e29b-41d4-a716-446655440030',
        nombre: 'Carga General',
        descripcion: 'Mercancía estándar sin características especiales de manejo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440031',
        nombre: 'Carga Refrigerada',
        descripcion: 'Mercancía que requiere control de temperatura durante el transporte',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipos_carga', {
      id: [
        '550e8400-e29b-41d4-a716-446655440030',
        '550e8400-e29b-41d4-a716-446655440031'
      ]
    }, {});
  }
};