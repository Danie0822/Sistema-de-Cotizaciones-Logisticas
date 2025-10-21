'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('reglas_cargo', [
      {
        id: '550e8400-e29b-41d4-a716-446655440050',
        tipo_carga_id: '550e8400-e29b-41d4-a716-446655440030', // Carga General
        nombre_rubro: 'Manejo de Carga',
        peso_min: 0.00,
        peso_max: 1000.00,
        metodo: 'porcentaje',
        valor: 10.00,
        orden: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440051',
        tipo_carga_id: '550e8400-e29b-41d4-a716-446655440031', // Carga Refrigerada
        nombre_rubro: 'Cargo Refrigeración',
        peso_min: 0.00,
        peso_max: null,
        metodo: 'cuota_fija',
        valor: 250.00,
        orden: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reglas_cargo', {
      id: [
        '550e8400-e29b-41d4-a716-446655440050',
        '550e8400-e29b-41d4-a716-446655440051'
      ]
    }, {});
  }
};