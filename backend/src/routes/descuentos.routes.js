const express = require('express');
const {
  getAll,
  save,
  getById,
  update,
  destroy
} = require('../controllers/descuento.controller');
const {checkAuth} = require('../middlewares/checkAuth');
const validateRequest = require('../utils/validateRequest');
const {
  readDescuentoRequestSchema,
  createDescuentoRequestSchema,
  updateDescuentoRequestSchema,
  deleteDescuentoRequestSchema,
} = require('../validations/descuento.schema');

const router = express.Router();
router.use(checkAuth('admin')); // Aplicar middleware de autenticación a todas las rutas de este router
/**
 * @swagger
 * tags:
 *   name: Descuentos
 *   description: Endpoints related to descuento operations
 */

/**
 * @swagger
 * /descuentos:
 *   get:
 *     summary: Retrieve all descuentos
 *     tags: [Descuentos] 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of descuentos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Descuento"
 */
router.get('/', getAll);

/**
 * @swagger
 * /descuentos:
 *   post:
 *     summary: Create a new descuento
 *     tags: [Descuentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Descuento"
 *     responses:
 *       201:
 *         description: Descuento created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Descuento"
 *       400:
 *         description: Error creating descuento.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/', validateRequest(createDescuentoRequestSchema), save);

/**
 * @swagger
 * /descuentos/{id}:
 *   get:
 *     summary: Retrieve a descuento by ID
 *     tags: [Descuentos] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The descuento ID.
 *     responses:
 *       200:
 *         description: Descuento details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Descuento"
 *       404:
 *         description: Descuento not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:id', validateRequest(readDescuentoRequestSchema), getById);

/**
 * @swagger
 * /descuentos/{id}:
 *   put:
 *     summary: Update a descuento by ID
 *     tags: [Descuentos] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The descuento ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Descuento"
 *     responses:
 *       200:
 *         description: Descuento updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Descuento"
 *       404:
 *         description: Descuento not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put('/:id', validateRequest(updateDescuentoRequestSchema), update);

/**
 * @swagger
 * /descuentos/{id}:
 *   delete:
 *     summary: Delete a descuento by ID
 *     tags: [Descuentos] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The descuento ID.
 *     responses:
 *       200:
 *         description: Descuento deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Descuento deleted successfully"
 *       404:
 *         description: Descuento not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/:id', validateRequest(deleteDescuentoRequestSchema), destroy);

module.exports = router;
