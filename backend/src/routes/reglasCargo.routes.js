const express = require('express');
const {
  getAll,
  save,
  getById,
  update,
  destroy,
  getByTipoCarga
} = require('../controllers/reglaCargo.controller');
const {checkAuth} = require('../middlewares/checkAuth');
const validateRequest = require('../utils/validateRequest');
const {
  readReglaCargoRequestSchema,
  createReglaCargoRequestSchema,
  updateReglaCargoRequestSchema,
  deleteReglaCargoRequestSchema,
  getByTipoCargarRequestSchema,
} = require('../validations/reglaCargo.schema');

const router = express.Router();
router.use(checkAuth('admin')); // Aplicar middleware de autenticación a todas las rutas de este router
/**
 * @swagger
 * tags:
 *   name: Reglas de Cargo
 *   description: Endpoints related to regla cargo operations
 */

/**
 * @swagger
 * /reglas-cargo:
 *   get:
 *     summary: Retrieve all reglas de cargo
 *     tags: [Reglas de Cargo] 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of reglas de cargo.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ReglaCargo"
 */
router.get('/', getAll);

/**
 * @swagger
 * /reglas-cargo:
 *   post:
 *     summary: Create a new regla de cargo
 *     tags: [Reglas de Cargo] 
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ReglaCargo"
 *     responses:
 *       201:
 *         description: Regla de cargo created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ReglaCargo"
 *       400:
 *         description: Error creating regla de cargo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/', validateRequest(createReglaCargoRequestSchema), save);

/**
 * @swagger
 * /reglas-cargo/{id}:
 *   get:
 *     summary: Retrieve a regla de cargo by ID
 *     tags: [Reglas de Cargo] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The regla cargo ID.
 *     responses:
 *       200:
 *         description: Regla de cargo details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ReglaCargo"
 *       404:
 *         description: Regla de cargo not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:id', validateRequest(readReglaCargoRequestSchema), getById);

/**
 * @swagger
 * /reglas-cargo/{id}:
 *   put:
 *     summary: Update a regla de cargo by ID
 *     tags: [Reglas de Cargo] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The regla cargo ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ReglaCargo"
 *     responses:
 *       200:
 *         description: Regla de cargo updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ReglaCargo"
 *       404:
 *         description: Regla de cargo not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put('/:id', validateRequest(updateReglaCargoRequestSchema), update);

/**
 * @swagger
 * /reglas-cargo/{id}:
 *   delete:
 *     summary: Delete a regla de cargo by ID
 *     tags: [Reglas de Cargo] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The regla cargo ID.
 *     responses:
 *       200:
 *         description: Regla de cargo deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Regla de cargo deleted successfully"
 *       404:
 *         description: Regla de cargo not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/:id', validateRequest(deleteReglaCargoRequestSchema), destroy);

/**
 * @swagger
 * /reglas-cargo/tipo-carga/{tipoCargoId}:
 *   get:
 *     summary: Retrieve reglas de cargo by tipo de carga ID
 *     tags: [Reglas de Cargo] 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tipoCargoId
 *         required: true
 *         schema:
 *           type: string
 *         description: The tipo cargo ID.
 *     responses:
 *       200:
 *         description: Reglas de cargo for the specified tipo de carga.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ReglaCargo"
 */
router.get('/tipo-carga/:tipoCargoId', validateRequest(getByTipoCargarRequestSchema), getByTipoCarga);

module.exports = router;
