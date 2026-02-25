const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     Impuesto:
 *       type: object
 *       required:
 *         - nombre
 *         - codigo
 *         - tipo
 *         - valor
 *         - vigencia_desde
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the impuesto.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         nombre:
 *           type: string
 *           description: Name of the tax.
 *           example: "IVA"
 *         codigo:
 *           type: string
 *           description: Tax code (unique).
 *           example: "IVA_19"
 *         tipo:
 *           type: string
 *           enum: ["porcentaje", "monto_fijo"]
 *           description: Type of tax calculation.
 *           example: "porcentaje"
 *         valor:
 *           type: number
 *           description: Tax value (percentage or fixed amount).
 *           example: 19.00
 *         aplicable_a:
 *           type: string
 *           enum: ["subtotal_neto", "total_bruto", "tarifa_base"]
 *           description: Base on which to calculate the tax.
 *           example: "subtotal_neto"
 *         es_acumulativo:
 *           type: boolean
 *           description: Whether other taxes can be calculated on this tax.
 *           example: false
 *         vigencia_desde:
 *           type: string
 *           format: date-time
 *           description: Tax effective date.
 *           example: "2024-01-01T00:00:00.000Z"
 *         vigencia_hasta:
 *           type: string
 *           format: date-time
 *           description: Tax expiration date (optional).
 *           example: null
 *         activo:
 *           type: boolean
 *           description: Whether the tax is active.
 *           example: true
 *     ImpuestoRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - codigo
 *         - tipo
 *         - valor
 *         - vigencia_desde
 *       properties:
 *         nombre:
 *           type: string
 *           example: "IVA"
 *         codigo:
 *           type: string
 *           example: "IVA_19"
 *         tipo:
 *           type: string
 *           enum: ["porcentaje", "monto_fijo"]
 *           example: "porcentaje"
 *         valor:
 *           type: number
 *           example: 19.00
 *         aplicable_a:
 *           type: string
 *           enum: ["subtotal_neto", "total_bruto", "tarifa_base"]
 *           example: "subtotal_neto"
 *         es_acumulativo:
 *           type: boolean
 *           example: false
 *         vigencia_desde:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         vigencia_hasta:
 *           type: string
 *           format: date-time
 *           example: null
 *         activo:
 *           type: boolean
 *           example: true
 */

const createImpuestoSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre del impuesto es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  codigo: z.string()
    .min(1, 'El código del impuesto es requerido')
    .max(20, 'El código no puede exceder 20 caracteres'),
  tipo: z.enum(['porcentaje', 'monto_fijo'], {
    errorMap: () => ({ message: 'El tipo debe ser "porcentaje" o "monto_fijo"' })
  }),
  valor: z.number()
    .min(0, 'El valor debe ser mayor o igual a 0'),
  aplicable_a: z.enum(['subtotal_neto', 'total_bruto', 'tarifa_base'], {
    errorMap: () => ({ message: 'aplicable_a debe ser "subtotal_neto", "total_bruto" o "tarifa_base"' })
  }).optional().default('subtotal_neto'),
  es_acumulativo: z.boolean().optional().default(false),
  vigencia_desde: z.string().datetime({ message: 'vigencia_desde debe ser una fecha válida' }),
  vigencia_hasta: z.string().datetime({ message: 'vigencia_hasta debe ser una fecha válida' }).optional().nullable(),
  activo: z.boolean().optional().default(true)
});

const updateImpuestoSchema = createImpuestoSchema.partial();

const impuestoIdSchema = z.object({
  id: z.string().uuid({ message: 'El ID debe ser un UUID válido' })
});

module.exports = {
  createImpuestoSchema,
  updateImpuestoSchema,
  impuestoIdSchema
};
