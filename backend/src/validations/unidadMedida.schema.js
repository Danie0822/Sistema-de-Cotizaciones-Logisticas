const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     UnidadMedida:
 *       type: object
 *       required:
 *         - codigo
 *         - descripcion
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the unidad de medida.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         codigo:
 *           type: string
 *           description: Unique code for the unidad de medida.
 *           example: "kg"
 *         descripcion:
 *           type: string
 *           description: Description of the unidad de medida.
 *           example: "Kilogramo"
 */

// Schema for request parameters
const params = z.object({
    id: z.string().uuid({ message: 'The ID must be a valid UUID' }),
});

// Define the UnidadMedida schema
const unidadMedidaSchema = z.object({
    id: z.string().uuid(),
    codigo: z.string({
        required_error: 'Código is required',
    })
        .min(1, 'Código must be at least 1 character')
        .max(10, 'Código must not exceed 10 characters'),
    descripcion: z.string({
        required_error: 'Descripción is required',
    })
        .min(1, 'Descripción must be at least 1 character')
        .max(50, 'Descripción must not exceed 50 characters'),
});

const readUnidadMedidaRequestSchema = z.object({
    params,
});

const createUnidadMedidaRequestSchema = z.object({
    body: unidadMedidaSchema.omit({ id: true }),
});

const updateUnidadMedidaRequestSchema = z.object({
    params,
    body: unidadMedidaSchema.omit({ id: true }),
});

const deleteUnidadMedidaRequestSchema = z.object({
    params,
});

module.exports = {
    readUnidadMedidaRequestSchema,
    createUnidadMedidaRequestSchema,
    updateUnidadMedidaRequestSchema,
    deleteUnidadMedidaRequestSchema,
};
