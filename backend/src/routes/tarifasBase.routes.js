const express = require('express');
const {
  getAll,
  save,
  getById,
  update,
  destroy,
  getByCliente
} = require('../controllers/tarifaBase.controller');
const {checkAuth} = require('../middlewares/checkAuth');
const validateRequest = require('../utils/validateRequest');
const {
  readTarifaBaseRequestSchema,
  createTarifaBaseRequestSchema,
  updateTarifaBaseRequestSchema,
  deleteTarifaBaseRequestSchema,
  getByClienteRequestSchema,
} = require('../validations/tarifaBase.schema');

const router = express.Router();
router.use(checkAuth('admin')); // Aplicar middleware de autenticación a todas las rutas de este router
/**
 * @swagger
 * tags:
 *   name: Tarifas Base
 *   description: Endpoints related to tarifa base operations
 */

/**
 * @swagger
 * /tarifas-base:
 *   get:
 *     summary: Retrieve all tarifas base
 *     tags: [Tarifas Base] 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tarifas base.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/TarifaBase"
 */
router.get('/', getAll);

/**
 * @swagger
 * /tarifas-base:
 *   post:
 *     summary: Create a new tarifa base
 *     tags: [Tarifas Base] 
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TarifaBase"
 *     responses:
 *       201:
 *         description: Tarifa base created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TarifaBase"
 *       400:
 *         description: Error creating tarifa base.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/', validateRequest(createTarifaBaseRequestSchema), save);

/**
 * @swagger
 * /tarifas-base/{id}:
 *   get:
 *     summary: Retrieve a tarifa base by ID
 *     tags: [Tarifas Base] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tarifa base ID.
 *     responses:
 *       200:
 *         description: Tarifa base details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TarifaBase"
 *       404:
 *         description: Tarifa base not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:id', validateRequest(readTarifaBaseRequestSchema), getById);

/**
 * @swagger
 * /tarifas-base/{id}:
 *   put:
 *     summary: Update a tarifa base by ID
 *     tags: [Tarifas Base] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tarifa base ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TarifaBase"
 *     responses:
 *       200:
 *         description: Tarifa base updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TarifaBase"
 *       404:
 *         description: Tarifa base not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put('/:id', validateRequest(updateTarifaBaseRequestSchema), update);

/**
 * @swagger
 * /tarifas-base/{id}:
 *   delete:
 *     summary: Delete a tarifa base by ID
 *     tags: [Tarifas Base] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tarifa base ID.
 *     responses:
 *       200:
 *         description: Tarifa base deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tarifa base deleted successfully"
 *       404:
 *         description: Tarifa base not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/:id', validateRequest(deleteTarifaBaseRequestSchema), destroy);

/**
 * @swagger
 * /tarifas-base/cliente/{clienteId}:
 *   get:
 *     summary: Retrieve tarifas base by cliente ID
 *     tags: [Tarifas Base] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: The cliente ID.
 *     responses:
 *       200:
 *         description: Tarifas base for the specified cliente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/TarifaBase"
 */
router.get('/cliente/:clienteId', validateRequest(getByClienteRequestSchema), getByCliente);

module.exports = router;
