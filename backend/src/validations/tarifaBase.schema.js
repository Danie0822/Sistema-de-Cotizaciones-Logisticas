const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     TarifaBase:
 *       type: object
 *       required:
 *         - tipo_carga_id
 *         - unidad_id
 *         - precio_unitario
 *         - vigencia_desde
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the tarifa base.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         cliente_id:
 *           type: string
 *           format: uuid
 *           description: ID of the client (optional).
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         tipo_carga_id:
 *           type: string
 *           format: uuid
 *           description: ID of the tipo de carga.
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         unidad_id:
 *           type: string
 *           format: uuid
 *           description: ID of the unidad de medida.
 *           example: "550e8400-e29b-41d4-a716-446655440003"
 *         precio_unitario:
 *           type: number
 *           description: Unit price for the tariff.
 *           example: 25.50
 *         vigencia_desde:
 *           type: string
 *           format: date
 *           description: Start date of validity.
 *           example: "2024-01-01"
 *         vigencia_hasta:
 *           type: string
 *           format: date
 *           description: End date of validity.
 *           example: "2024-12-31"
 */

// Schema for request parameters
const params = z.object({
    id: z.string().uuid({ message: 'The ID must be a valid UUID' }),
});

// Schema for cliente_id parameter
const clienteParams = z.object({
    clienteId: z.string().uuid({ message: 'The cliente_id must be a valid UUID' }),
});

// Define the TarifaBase schema
const tarifaBaseSchema = z.object({
    id: z.string().uuid(),
    cliente_id: z.string()
        .uuid('Cliente ID must be a valid UUID')
        .optional()
        .nullable(),
    tipo_carga_id: z.string({
        required_error: 'Tipo carga ID is required',
    }).uuid('Tipo carga ID must be a valid UUID'),
    unidad_id: z.string({
        required_error: 'Unidad ID is required',
    }).uuid('Unidad ID must be a valid UUID'),
    precio_unitario: z.number({
        required_error: 'Precio unitario is required',
    })
        .min(0, 'Precio unitario must be at least 0'),
    vigencia_desde: z.string({
        required_error: 'Vigencia desde is required',
    })
        .refine((date) => !isNaN(Date.parse(date)), 'Vigencia desde must be a valid date'),
    vigencia_hasta: z.string()
        .refine((date) => !isNaN(Date.parse(date)), 'Vigencia hasta must be a valid date')
        .optional()
        .nullable(),
});

const readTarifaBaseRequestSchema = z.object({
    params,
});

const createTarifaBaseRequestSchema = z.object({
    body: tarifaBaseSchema.omit({ id: true }),
});

const updateTarifaBaseRequestSchema = z.object({
    params,
    body: tarifaBaseSchema.omit({ id: true }),
});

const deleteTarifaBaseRequestSchema = z.object({
    params,
});

const getByClienteRequestSchema = z.object({
    params: clienteParams,
});

module.exports = {
    readTarifaBaseRequestSchema,
    createTarifaBaseRequestSchema,
    updateTarifaBaseRequestSchema,
    deleteTarifaBaseRequestSchema,
    getByClienteRequestSchema,
};
