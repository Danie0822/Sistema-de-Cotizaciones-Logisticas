'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tarifas_base', [
      {
        id: '550e8400-e29b-41d4-a716-446655440060',
        cliente_id: '550e8400-e29b-41d4-a716-446655440010', // Empresa Logística ABC S.A.
        tipo_carga_id: '550e8400-e29b-41d4-a716-446655440030', // Carga General
        unidad_id: '550e8400-e29b-41d4-a716-446655440020', // KG
        precio_unitario: 25.50,
        vigencia_desde: '2025-01-01',
        vigencia_hasta: '2025-12-31',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440061',
        cliente_id: '550e8400-e29b-41d4-a716-446655440011', // Corporación de Transporte XYZ
        tipo_carga_id: '550e8400-e29b-41d4-a716-446655440031', // Carga Refrigerada
        unidad_id: '550e8400-e29b-41d4-a716-446655440021', // TON
        precio_unitario: 850.75,
        vigencia_desde: '2025-01-01',
        vigencia_hasta: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tarifas_base', {
      id: [
        '550e8400-e29b-41d4-a716-446655440060',
        '550e8400-e29b-41d4-a716-446655440061'
      ]
    }, {});
  }
};