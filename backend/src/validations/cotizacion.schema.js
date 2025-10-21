const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     Cotizacion:
 *       type: object
 *       required:
 *         - cliente_id
 *         - tipo_carga_id
 *         - unidad_id
 *         - monto_total
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the cotización.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         cliente_id:
 *           type: string
 *           format: uuid
 *           description: ID of the client.
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
 *         fecha_cotizacion:
 *           type: string
 *           format: date-time
 *           description: Date of the quotation.
 *           example: "2024-01-15T10:30:00.000Z"
 *         monto_total:
 *           type: number
 *           description: Total amount of the quotation.
 *           example: 1250.75
 *     CotizacionRequest:
 *       type: object
 *       required:
 *         - cliente_id
 *         - tipo_carga_id
 *         - unidad_id
 *         - peso
 *       properties:
 *         cliente_id:
 *           type: string
 *           format: uuid
 *           description: ID of the client.
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
 *         peso:
 *           type: number
 *           description: Weight for the quotation calculation.
 *           example: 150.5
 *         descuento_id:
 *           type: string
 *           format: uuid
 *           description: ID of the discount (optional).
 *           example: "550e8400-e29b-41d4-a716-446655440004"
 */

// Schema for cotizacion report parameter
const reportParams = z.object({
    cotizacionId: z.string().uuid({ message: 'The cotizacion_id must be a valid UUID' }),
});

// Schema for creating quotation with stored procedure
const crearCotizacionSchema = z.object({
    cliente_id: z.string({
        required_error: 'Cliente ID is required',
    }).uuid('Cliente ID must be a valid UUID'),
    tipo_carga_id: z.string({
        required_error: 'Tipo carga ID is required',
    }).uuid('Tipo carga ID must be a valid UUID'),
    unidad_id: z.string({
        required_error: 'Unidad ID is required',
    }).uuid('Unidad ID must be a valid UUID'),
    peso: z.number({
        required_error: 'Peso is required',
    })
        .min(0, 'Peso must be at least 0'),
    descuento_id: z.string()
        .uuid('Descuento ID must be a valid UUID')
        .optional()
        .nullable(),
});

const crearCotizacionRequestSchema = z.object({
    body: crearCotizacionSchema,
});

const reporteDetalladoRequestSchema = z.object({
    params: reportParams,
});

module.exports = {
    crearCotizacionRequestSchema,
    reporteDetalladoRequestSchema,
};
