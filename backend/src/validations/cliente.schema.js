const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the cliente.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         nombre:
 *           type: string
 *           description: The name of the cliente.
 *           example: "Empresa ABC S.A."
 *         contacto:
 *           type: string
 *           description: Contact person for the cliente.
 *           example: "Juan Pérez"
 */

// Schema for request parameters
const params = z.object({
    id: z.string().uuid({ message: 'The ID must be a valid UUID' }),
});

// Define the Cliente schema
const clienteSchema = z.object({
    id: z.string().uuid(),
    nombre: z.string({
        required_error: 'Nombre is required',
    })
        .min(1, 'Nombre must be at least 1 character')
        .max(100, 'Nombre must not exceed 100 characters'),
    contacto: z.string()
        .max(100, 'Contacto must not exceed 100 characters')
        .optional()
        .nullable(),
});

const readClienteRequestSchema = z.object({
    params,
});

const createClienteRequestSchema = z.object({
    body: clienteSchema.omit({ id: true }),
});

const updateClienteRequestSchema = z.object({
    params,
    body: clienteSchema.omit({ id: true }),
});

const deleteClienteRequestSchema = z.object({
    params,
});

module.exports = {
    readClienteRequestSchema,
    createClienteRequestSchema,
    updateClienteRequestSchema,
    deleteClienteRequestSchema,
};
