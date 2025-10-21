'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('descuentos', [
      {
        id: '550e8400-e29b-41d4-a716-446655440040',
        nombre_descuento: 'Descuento Cliente Premium',
        metodo: 'porcentaje',
        valor: 15.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440041',
        nombre_descuento: 'Descuento Fijo Volumen',
        metodo: 'cuota_fija',
        valor: 500.00,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('descuentos', {
      id: [
        '550e8400-e29b-41d4-a716-446655440040',
        '550e8400-e29b-41d4-a716-446655440041'
      ]
    }, {});
  }
};