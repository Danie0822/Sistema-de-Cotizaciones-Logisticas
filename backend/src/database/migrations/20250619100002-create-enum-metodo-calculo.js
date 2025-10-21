'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Crear ENUM para métodos de cálculo de rubros y descuentos
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
         IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'metodo_calculo_enum') THEN
            CREATE TYPE metodo_calculo_enum AS ENUM (
              'porcentaje',    -- aplica % sobre base
              'cuota_fija'     -- importe fijo
            );
         END IF;
      END;
      $$;
    `);
  },

  async down (queryInterface, Sequelize) {
    // Eliminar el ENUM
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS metodo_calculo_enum;');
  }
};
