const express = require('express');
const {
  getAll,
  save,
  getById,
  update,
  destroy
} = require('../controllers/unidadMedida.controller');
const {checkAuth} = require('../middlewares/checkAuth');
const validateRequest = require('../utils/validateRequest');
const {
  readUnidadMedidaRequestSchema,
  createUnidadMedidaRequestSchema,
  updateUnidadMedidaRequestSchema,
  deleteUnidadMedidaRequestSchema,
} = require('../validations/unidadMedida.schema');

const router = express.Router();
router.use(checkAuth('admin')); // Aplicar middleware de autenticación a todas las rutas de este router
/**
 * @swagger
 * tags:
 *   name: Unidades de Medida
 *   description: Endpoints related to unidad de medida operations
 */

/**
 * @swagger
 * /unidades-medida:
 *   get:
 *     summary: Retrieve all unidades de medida
 *     tags: [Unidades de Medida] 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of unidades de medida.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/UnidadMedida"
 */
router.get('/', getAll);

/**
 * @swagger
 * /unidades-medida:
 *   post:
 *     summary: Create a new unidad de medida
 *     tags: [Unidades de Medida]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UnidadMedida"
 *     responses:
 *       201:
 *         description: Unidad de medida created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnidadMedida"
 *       400:
 *         description: Error creating unidad de medida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/', validateRequest(createUnidadMedidaRequestSchema), save);

/**
 * @swagger
 * /unidades-medida/{id}:
 *   get:
 *     summary: Retrieve a unidad de medida by ID
 *     tags: [Unidades de Medida] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unidad medida ID.
 *     responses:
 *       200:
 *         description: Unidad de medida details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnidadMedida"
 *       404:
 *         description: Unidad de medida not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:id', validateRequest(readUnidadMedidaRequestSchema), getById);

/**
 * @swagger
 * /unidades-medida/{id}:
 *   put:
 *     summary: Update a unidad de medida by ID
 *     tags: [Unidades de Medida] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unidad medida ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UnidadMedida"
 *     responses:
 *       200:
 *         description: Unidad de medida updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnidadMedida"
 *       404:
 *         description: Unidad de medida not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put('/:id', validateRequest(updateUnidadMedidaRequestSchema), update);

/**
 * @swagger
 * /unidades-medida/{id}:
 *   delete:
 *     summary: Delete a unidad de medida by ID
 *     tags: [Unidades de Medida] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unidad medida ID.
 *     responses:
 *       200:
 *         description: Unidad de medida deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unidad de medida deleted successfully"
 *       404:
 *         description: Unidad de medida not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/:id', validateRequest(deleteUnidadMedidaRequestSchema), destroy);

module.exports = router;
