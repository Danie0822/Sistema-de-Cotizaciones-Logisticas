const express = require('express');
const {
  getAll,
  save,
  getById,
  update,
  destroy
} = require('../controllers/tipoCarga.controller');
const {checkAuth} = require('../middlewares/checkAuth');
const validateRequest = require('../utils/validateRequest');
const {
  readTipoCargarRequestSchema,
  createTipoCargarRequestSchema,
  updateTipoCargarRequestSchema,
  deleteTipoCargarRequestSchema,
} = require('../validations/tipoCarga.schema');

const router = express.Router();
router.use(checkAuth('admin')); // Import the middleware for authentication by role the admin
/**
 * @swagger
 * tags:
 *   name: Tipos de Carga
 *   description: Endpoints related to tipo de carga operations
 */

/**
 * @swagger
 * /tipos-carga:
 *   get:
 *     summary: Retrieve all tipos de carga
 *     tags: [Tipos de Carga] 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tipos de carga.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/TipoCarga"
 */
router.get('/', getAll);

/**
 * @swagger
 * /tipos-carga:
 *   post:
 *     summary: Create a new tipo de carga
 *     tags: [Tipos de Carga] 
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TipoCarga"
 *     responses:
 *       201:
 *         description: Tipo de carga created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TipoCarga"
 *       400:
 *         description: Error creating tipo de carga.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/', validateRequest(createTipoCargarRequestSchema), save);

/**
 * @swagger
 * /tipos-carga/{id}:
 *   get:
 *     summary: Retrieve a tipo de carga by ID
 *     tags: [Tipos de Carga] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tipo carga ID.
 *     responses:
 *       200:
 *         description: Tipo de carga details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TipoCarga"
 *       404:
 *         description: Tipo de carga not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:id', validateRequest(readTipoCargarRequestSchema), getById);

/**
 * @swagger
 * /tipos-carga/{id}:
 *   put:
 *     summary: Update a tipo de carga by ID
 *     tags: [Tipos de Carga] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tipo carga ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TipoCarga"
 *     responses:
 *       200:
 *         description: Tipo de carga updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TipoCarga"
 *       404:
 *         description: Tipo de carga not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put('/:id', validateRequest(updateTipoCargarRequestSchema), update);

/**
 * @swagger
 * /tipos-carga/{id}:
 *   delete:
 *     summary: Delete a tipo de carga by ID
 *     tags: [Tipos de Carga] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tipo carga ID.
 *     responses:
 *       200:
 *         description: Tipo de carga deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tipo de carga deleted successfully"
 *       404:
 *         description: Tipo de carga not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/:id', validateRequest(deleteTipoCargarRequestSchema), destroy);

module.exports = router;
