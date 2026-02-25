'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('impuestos', [
      // Impuestos generales (aplican a cualquier tipo de carga)
      {
        id: '550e8400-e29b-41d4-a716-446655440080',
        tipo_carga_id: null, // Aplica a todos los tipos de carga
        nombre: 'IVA 15%',
        codigo: 'IVA15',
        tipo: 'porcentaje',
        valor: 15.00,
        aplicable_a: 'subtotal_neto',
        es_acumulativo: false,
        vigencia_desde: new Date('2024-01-01'),
        vigencia_hasta: null,
        activo: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440081',
        tipo_carga_id: null, // Aplica a todos los tipos de carga
        nombre: 'ISV 12%',
        codigo: 'ISV12',
        tipo: 'porcentaje',
        valor: 12.00,
        aplicable_a: 'subtotal_neto',
        es_acumulativo: false,
        vigencia_desde: new Date('2024-01-01'),
        vigencia_hasta: null,
        activo: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Impuestos específicos para Carga General
      {
        id: '550e8400-e29b-41d4-a716-446655440082',
        tipo_carga_id: '550e8400-e29b-41d4-a716-446655440030', // Carga General
        nombre: 'Impuesto Combustible',
        codigo: 'ICOMB',
        tipo: 'monto_fijo',
        valor: 50.00,
        aplicable_a: 'tarifa_base',
        es_acumulativo: false,
        vigencia_desde: new Date('2024-01-01'),
        vigencia_hasta: null,
        activo: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Impuestos específicos para Carga Refrigerada
      {
        id: '550e8400-e29b-41d4-a716-446655440083',
        tipo_carga_id: '550e8400-e29b-41d4-a716-446655440031', // Carga Refrigerada
        nombre: 'Impuesto Control Temperatura',
        codigo: 'ICTEMP',
        tipo: 'porcentaje',
        valor: 5.00,
        aplicable_a: 'tarifa_base',
        es_acumulativo: false,
        vigencia_desde: new Date('2024-01-01'),
        vigencia_hasta: null,
        activo: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('impuestos', {
      id: [
        '550e8400-e29b-41d4-a716-446655440080',
        '550e8400-e29b-41d4-a716-446655440081',
        '550e8400-e29b-41d4-a716-446655440082',
        '550e8400-e29b-41d4-a716-446655440083'
      ]
    }, {});
  }
};
