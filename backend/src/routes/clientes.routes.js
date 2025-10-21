const express = require('express');
const {
  getAll,
  save,
  getById,
  update,
  destroy
} = require('../controllers/cliente.controller');
const {checkAuth} = require('../middlewares/checkAuth');
const validateRequest = require('../utils/validateRequest');
const {
  readClienteRequestSchema,
  createClienteRequestSchema,
  updateClienteRequestSchema,
  deleteClienteRequestSchema,
} = require('../validations/cliente.schema');

const router = express.Router();
router.use(checkAuth('admin')); // Import the middleware for authentication by role the admin
/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Endpoints related to cliente operations
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Retrieve all clientes
 *     tags: [Clientes] 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of clientes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Cliente"
 */
router.get('/', getAll);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Create a new cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Cliente"
 *     responses:
 *       201:
 *         description: Cliente created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Cliente"
 *       400:
 *         description: Error creating cliente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/', validateRequest(createClienteRequestSchema), save);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Retrieve a cliente by ID
 *     tags: [Clientes] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cliente ID.
 *     responses:
 *       200:
 *         description: Cliente details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Cliente"
 *       404:
 *         description: Cliente not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:id', validateRequest(readClienteRequestSchema), getById);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Update a cliente by ID
 *     tags: [Clientes] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cliente ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Cliente"
 *     responses:
 *       200:
 *         description: Cliente updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Cliente"
 *       404:
 *         description: Cliente not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put('/:id', validateRequest(updateClienteRequestSchema), update);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Delete a cliente by ID
 *     tags: [Clientes] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cliente ID.
 *     responses:
 *       200:
 *         description: Cliente deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cliente deleted successfully"
 *       404:
 *         description: Cliente not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/:id', validateRequest(deleteClienteRequestSchema), destroy);

module.exports = router;
