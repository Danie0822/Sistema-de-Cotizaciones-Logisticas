'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        full_name: 'Administrador Principal',
        email: 'admin@cotizaciones.com',
        rol: 'admin',
        cellphone: '+504 9876-5432',
        password: '$2b$10$hcH.Cf8mFnkpCBzOpreC.OfqbKrfxDqsiLFd0EFVYQNvnP5bFRDYy',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        full_name: 'Usuario Operador',
        email: 'usuario@cotizaciones.com',
        rol: 'user',
        cellphone: '+504 8765-4321',
        password: '$2b$10$hcH.Cf8mFnkpCBzOpreC.OfqbKrfxDqsiLFd0EFVYQNvnP5bFRDYy',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      id: [
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002'
      ]
    }, {});
  }
};