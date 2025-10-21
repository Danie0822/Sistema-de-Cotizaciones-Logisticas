
const express = require('express');
const {
  crearCotizacion,
  getReporteDetallado,
  getReporteCompleto,
  getReporteDetalladoPDF,
  obtenerCotizaciones
} = require('../controllers/cotizacion.controller');
const { checkAuth } = require('../middlewares/checkAuth');
const validateRequest = require('../utils/validateRequest');
const {
  crearCotizacionRequestSchema,
  reporteDetalladoRequestSchema,
} = require('../validations/cotizacion.schema');

const router = express.Router();
router.use(checkAuth('admin')); // Aplicar middleware de autenticación a todas las rutas de este router
/**
 * @swagger
 * tags:
 *   name: Cotizaciones
 *   description: Endpoints related to cotizacion operations
 */
/**
 * @swagger
 * /cotizaciones:
 *   get:
 *     summary: Obtener todas las cotizaciones con información de cliente, tipo de carga y unidad de medida
 *     tags: [Cotizaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cotizaciones obtenidas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 route:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       cliente_id:
 *                         type: string
 *                         format: uuid
 *                       tipo_carga_id:
 *                         type: string
 *                         format: uuid
 *                       unidad_id:
 *                         type: string
 *                         format: uuid
 *                       fecha_cotizacion:
 *                         type: string
 *                         format: date-time
 *                       monto_total:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                       deleted_at:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       cliente:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           nombre:
 *                             type: string
 *                       tipoCarga:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           nombre:
 *                             type: string
 *                       unidadMedida:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           codigo:
 *                             type: string
 *                           descripcion:
 *                             type: string
 *             examples:
 *               ejemplo:
 *                 value:
 *                   success: true
 *                   route: /cotizacion
 *                   message: Cotizaciones obtenidas exitosamente
 *                   data:
 *                     - id: 57faeeaa-91d4-4084-8399-8448e90fe09c
 *                       cliente_id: 2057d64d-a977-4d3f-b6d8-6dbbd89a3132
 *                       tipo_carga_id: ee6665f9-63ba-4ccc-b7e9-9e6216702b16
 *                       unidad_id: 9bb314d7-3127-4f3c-b6ac-ec6f4d5a0950
 *                       fecha_cotizacion: "2025-06-19T23:07:45.270Z"
 *                       monto_total: "234.4000"
 *                       created_at: "2025-06-19T23:07:45.270Z"
 *                       updated_at: "2025-06-19T23:07:45.270Z"
 *                       deleted_at: null
 *                       cliente:
 *                         id: 2057d64d-a977-4d3f-b6d8-6dbbd89a3132
 *                         nombre: ACME Corp
 *                       tipoCarga:
 *                         id: ee6665f9-63ba-4ccc-b7e9-9e6216702b16
 *                         nombre: Aéreo
 *                       unidadMedida:
 *                         id: 9bb314d7-3127-4f3c-b6ac-ec6f4d5a0950
 *                         codigo: LB
 *                         descripcion: Libra
 *       401:
 *         description: No autorizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/', obtenerCotizaciones);
/**
 * @swagger
 * /cotizaciones/crear:
 *   post:
 *     summary: Create a new cotizacion using stored procedure and return PDF
 *     tags: [Cotizaciones] 
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: string
 *                 format: uuid
 *                 description: Client ID
 *               tipo_carga_id:
 *                 type: string
 *                 format: uuid
 *                 description: Cargo type ID
 *               unidad_id:
 *                 type: string
 *                 format: uuid
 *                 description: Unit ID
 *               peso:
 *                 type: number
 *                 description: Weight for the quotation
 *               descuento_id:
 *                 type: string
 *                 format: uuid
 *                 description: Discount ID (optional)
 *               includeNotes:
 *                 type: boolean
 *                 description: Include additional notes in the PDF
 *                 default: false
 *               includeTerms:
 *                 type: boolean
 *                 description: Include terms and conditions in the PDF
 *                 default: true
 *               notes:
 *                 type: string
 *                 description: Additional notes to include in the PDF
 *             required:
 *               - cliente_id
 *               - tipo_carga_id
 *               - unidad_id
 *               - peso
 *     responses:
 *       200:
 *         description: Cotizacion created successfully and PDF returned.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Validation error in request data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Error creating cotizacion or generating PDF.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/crear', validateRequest(crearCotizacionRequestSchema), crearCotizacion);

/**
 * @swagger
 * /cotizaciones/reporte/{cotizacionId}:
 *   get:
 *     summary: Get detailed report for a specific cotizacion
 *     tags: [Cotizaciones] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cotizacionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The cotizacion ID for the report.
 *     responses:
 *       200:
 *         description: Detailed report for the cotizacion.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cotizacion_id:
 *                     type: string
 *                     format: uuid
 *                   fecha_cotizacion:
 *                     type: string
 *                     format: date-time
 *                   cliente:
 *                     type: string
 *                   tipo_carga:
 *                     type: string
 *                   unidad:
 *                     type: string
 *                   concepto_id:
 *                     type: string
 *                     format: uuid
 *                   concepto:
 *                     type: string
 *                   importe:
 *                     type: number
 *                   tipo_detalle:
 *                     type: string
 *       404:
 *         description: Cotizacion not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/reporte/:cotizacionId', validateRequest(reporteDetalladoRequestSchema), getReporteDetallado);

/**
 * @swagger
 * /cotizaciones/reporte:
 *   get:
 *     summary: Get complete detailed report for all cotizaciones
 *     tags: [Cotizaciones] 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complete detailed report for all cotizaciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cotizacion_id:
 *                     type: string
 *                     format: uuid
 *                   fecha_cotizacion:
 *                     type: string
 *                     format: date-time
 *                   cliente:
 *                     type: string
 *                   tipo_carga:
 *                     type: string
 *                   unidad:
 *                     type: string
 *                   concepto_id:
 *                     type: string
 *                     format: uuid
 *                   concepto:
 *                     type: string
 *                   importe:
 *                     type: number
 *                   tipo_detalle:
 *                     type: string
 */
router.get('/reporte', getReporteCompleto);

/**
 * @swagger
 * /cotizaciones/reporte/{cotizacionId}/pdf:
 *   post:
 *     summary: Generate PDF report for a specific cotizacion
 *     tags: [Cotizaciones] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cotizacionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The cotizacion ID for the PDF report.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               includeNotes:
 *                 type: boolean
 *                 description: Include additional notes in the report
 *                 default: false
 *               includeTerms:
 *                 type: boolean
 *                 description: Include terms and conditions
 *                 default: true
 *               notes:
 *                 type: string
 *                 description: Additional notes to include in the report
 *               includeSignatures:
 *                 type: boolean
 *                 description: Include signature section
 *                 default: true
 *               includeClientSignature:
 *                 type: boolean
 *                 description: Include client signature line
 *                 default: true
 *               includeAuthorizedSignature:
 *                 type: boolean
 *                 description: Include authorized signature line
 *                 default: true
 *     responses:
 *       200:
 *         description: PDF report generated successfully.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Cotizacion not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/reporte/:cotizacionId/pdf', getReporteDetalladoPDF);

module.exports = router;
