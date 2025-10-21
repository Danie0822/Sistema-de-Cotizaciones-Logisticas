const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     ReglaCargo:
 *       type: object
 *       required:
 *         - tipo_carga_id
 *         - nombre_rubro
 *         - metodo
 *         - valor
 *         - orden
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the regla cargo.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         tipo_carga_id:
 *           type: string
 *           format: uuid
 *           description: ID of the tipo de carga associated.
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         nombre_rubro:
 *           type: string
 *           description: Name of the cargo rule.
 *           example: "Combustible"
 *         peso_min:
 *           type: number
 *           description: Minimum weight for the rule.
 *           example: 0
 *         peso_max:
 *           type: number
 *           description: Maximum weight for the rule.
 *           example: 1000
 *         metodo:
 *           type: string
 *           enum: [porcentaje, cuota_fija]
 *           description: Calculation method for the charge.
 *           example: "porcentaje"
 *         valor:
 *           type: number
 *           description: Value for the calculation.
 *           example: 15.5
 *         orden:
 *           type: integer
 *           description: Order of application for the rule.
 *           example: 1
 */

// Schema for request parameters
const params = z.object({
    id: z.string().uuid({ message: 'The ID must be a valid UUID' }),
});

// Schema for tipo_carga_id parameter
const tipoCargoParams = z.object({
    tipoCargoId: z.string().uuid({ message: 'The tipo_carga_id must be a valid UUID' }),
});

// Define the ReglaCargo schema
const reglaCargoSchema = z.object({
    id: z.string().uuid(),
    tipo_carga_id: z.string({
        required_error: 'Tipo carga ID is required',
    }).uuid('Tipo carga ID must be a valid UUID'),
    nombre_rubro: z.string({
        required_error: 'Nombre rubro is required',
    })
        .min(1, 'Nombre rubro must be at least 1 character')
        .max(50, 'Nombre rubro must not exceed 50 characters'),
    peso_min: z.number()
        .min(0, 'Peso mínimo must be at least 0')
        .optional()
        .nullable(),
    peso_max: z.number()
        .min(0, 'Peso máximo must be at least 0')
        .optional()
        .nullable(),
    metodo: z.enum(['porcentaje', 'cuota_fija'], {
        required_error: 'Método is required',
    }),
    valor: z.number({
        required_error: 'Valor is required',
    })
        .min(0, 'Valor must be at least 0'),
    orden: z.number({
        required_error: 'Orden is required',
    })
        .int('Orden must be an integer')
        .min(0, 'Orden must be at least 0')
        .default(0),
});

const readReglaCargoRequestSchema = z.object({
    params,
});

const createReglaCargoRequestSchema = z.object({
    body: reglaCargoSchema.omit({ id: true }),
});

const updateReglaCargoRequestSchema = z.object({
    params,
    body: reglaCargoSchema.omit({ id: true }),
});

const deleteReglaCargoRequestSchema = z.object({
    params,
});

const getByTipoCargarRequestSchema = z.object({
    params: tipoCargoParams,
});

module.exports = {
    readReglaCargoRequestSchema,
    createReglaCargoRequestSchema,
    updateReglaCargoRequestSchema,
    deleteReglaCargoRequestSchema,
    getByTipoCargarRequestSchema,
};
