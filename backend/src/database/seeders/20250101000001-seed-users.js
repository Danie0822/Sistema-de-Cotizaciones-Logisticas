'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        full_name: 'Daniel Morales',
        email: 'ales@gmail.com',
        rol: 'admin',
        cellphone: '1234567890',
        password: '$2b$10$gtIrrSldXERvLJunZryXxOHBQ4sF4CdbHrCmuzkrZoPF2LgUcTxaa',
        created_at: new Date('2026-02-25T15:09:15.635Z'),
        updated_at: new Date('2026-02-25T15:09:15.635Z'),
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      id: ['550e8400-e29b-41d4-a716-446655440000']
    }, {});
  }
};