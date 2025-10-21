const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     Descuento:
 *       type: object
 *       required:
 *         - nombre_descuento
 *         - metodo
 *         - valor
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the descuento.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         nombre_descuento:
 *           type: string
 *           description: Name of the discount.
 *           example: "Descuento cliente frecuente"
 *         metodo:
 *           type: string
 *           enum: [porcentaje, cuota_fija]
 *           description: Calculation method for the discount.
 *           example: "porcentaje"
 *         valor:
 *           type: number
 *           description: Value for the discount calculation.
 *           example: 10.5
 */

// Schema for request parameters
const params = z.object({
    id: z.string().uuid({ message: 'The ID must be a valid UUID' }),
});

// Define the Descuento schema
const descuentoSchema = z.object({
    id: z.string().uuid(),
    nombre_descuento: z.string({
        required_error: 'Nombre descuento is required',
    })
        .min(1, 'Nombre descuento must be at least 1 character')
        .max(50, 'Nombre descuento must not exceed 50 characters'),
    metodo: z.enum(['porcentaje', 'cuota_fija'], {
        required_error: 'Método is required',
    }),
    valor: z.number({
        required_error: 'Valor is required',
    })
        .min(0, 'Valor must be at least 0'),
});

const readDescuentoRequestSchema = z.object({
    params,
});

const createDescuentoRequestSchema = z.object({
    body: descuentoSchema.omit({ id: true }),
});

const updateDescuentoRequestSchema = z.object({
    params,
    body: descuentoSchema.omit({ id: true }),
});

const deleteDescuentoRequestSchema = z.object({
    params,
});

module.exports = {
    readDescuentoRequestSchema,
    createDescuentoRequestSchema,
    updateDescuentoRequestSchema,
    deleteDescuentoRequestSchema,
};
