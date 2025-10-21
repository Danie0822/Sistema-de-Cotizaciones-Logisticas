const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoCarga:
 *       type: object
 *       required:
 *         - codigo
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the tipo de carga.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         nombre:
 *           type: string
 *           description: Name of the tipo de carga.
 *           example: "Contenedor 20 pies"
 *         descripcion:
 *           type: string
 *           description: Description of the tipo de carga.
 *           example: "Contenedor estándar de 20 pies para carga general"
 */

// Schema for request parameters
const params = z.object({
    id: z.string().uuid({ message: 'The ID must be a valid UUID' }),
});

// Define the TipoCarga schema
const tipoCargarSchema = z.object({
    id: z.string().uuid(),
    nombre: z.string({
        required_error: 'Nombre is required',
    })
        .min(1, 'Nombre must be at least 1 character')
        .max(100, 'Nombre must not exceed 100 characters'),
    descripcion: z.string()
        .optional()
        .nullable(),
});

const readTipoCargarRequestSchema = z.object({
    params,
});

const createTipoCargarRequestSchema = z.object({
    body: tipoCargarSchema.omit({ id: true }),
});

const updateTipoCargarRequestSchema = z.object({
    params,
    body: tipoCargarSchema.omit({ id: true }),
});

const deleteTipoCargarRequestSchema = z.object({
    params,
});

module.exports = {
    readTipoCargarRequestSchema,
    createTipoCargarRequestSchema,
    updateTipoCargarRequestSchema,
    deleteTipoCargarRequestSchema,
};
