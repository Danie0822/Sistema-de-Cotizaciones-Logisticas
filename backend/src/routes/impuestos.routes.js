const express = require('express');
const router = express.Router();
const ImpuestoController = require('../controllers/impuesto.controller');
const {checkAuth} = require('../middlewares/checkAuth'); // Import de middleware de autenticación
const validateRequest = require('../utils/validateRequest');
const {
  createImpuestoRequestSchema,
  updateImpuestoRequestSchema,
  deleteImpuestoRequestSchema,
} = require('../validations/impuesto.schema'); // Importaciones de los esquemas de validación
router.use(checkAuth('admin')); // Aplicar middleware de autenticación a todas las rutas de este router
// Aplicar middleware de autenticación a todas las rutas de impuestos

/**
 * @swagger
 * /api/impuestos:
 *   get:
 *     tags:
 *       - Impuestos
 *     summary: Obtener todos los impuestos
 *     description: Obtiene la lista completa de impuestos del sistema.
 *     responses:
 *       200:
 *         description: Lista de impuestos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Impuesto'
 *       401:
 *         description: No autorizado
 */
router.get('/',  ImpuestoController.obtenerImpuestos);

/**
 * @swagger
 * /api/impuestos/activos:
 *   get:
 *     tags:
 *       - Impuestos
 *     summary: Obtener impuestos activos y vigentes
 *     description: Obtiene solo los impuestos que están activos y dentro de su vigencia.
 *     responses:
 *       200:
 *         description: Lista de impuestos activos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Impuesto'
 *       401:
 *         description: No autorizado
 */
router.get('/activos',  ImpuestoController.obtenerImpuestosActivos);

/**
 * @swagger
 * /api/impuestos/{id}:
 *   get:
 *     tags:
 *       - Impuestos
 *     summary: Obtener un impuesto por ID
 *     description: Obtiene los detalles de un impuesto específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del impuesto
 *     responses:
 *       200:
 *         description: Impuesto obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Impuesto'
 *       404:
 *         description: Impuesto no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/:id',  ImpuestoController.obtenerImpuestoPorId);

/**
 * @swagger
 * /api/impuestos:
 *   post:
 *     tags:
 *       - Impuestos
 *     summary: Crear un nuevo impuesto
 *     description: Crea un nuevo registro de impuesto en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ImpuestoRequest'
 *     responses:
 *       201:
 *         description: Impuesto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Impuesto'
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/',  ImpuestoController.crearImpuesto, validateRequest(createImpuestoRequestSchema));

/**
 * @swagger
 * /api/impuestos/{id}:
 *   put:
 *     tags:
 *       - Impuestos
 *     summary: Actualizar un impuesto
 *     description: Actualiza los datos de un impuesto existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del impuesto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ImpuestoRequest'
 *     responses:
 *       200:
 *         description: Impuesto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Impuesto'
 *       404:
 *         description: Impuesto no encontrado
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 */
router.put('/:id',  ImpuestoController.actualizarImpuesto, validateRequest(updateImpuestoRequestSchema));

/**
 * @swagger
 * /api/impuestos/{id}:
 *   delete:
 *     tags:
 *       - Impuestos
 *     summary: Eliminar un impuesto
 *     description: Elimina un impuesto del sistema (soft delete).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del impuesto
 *     responses:
 *       200:
 *         description: Impuesto eliminado exitosamente
 *       404:
 *         description: Impuesto no encontrado
 *       401:
 *         description: No autorizado
 */
router.delete('/:id',  ImpuestoController.eliminarImpuesto);

module.exports = router;
