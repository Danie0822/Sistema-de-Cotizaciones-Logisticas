const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { Impuesto } = require('../models');
const { Op } = require('sequelize');

class ImpuestoController {
    static get service() {
        return new CrudService(Impuesto);
    }
    
    static get routes() {
        return '/impuestos';
    }

    /**
     * Obtener todos los impuestos
     */
    static obtenerImpuestos = catchErrors(async (req, res, next) => {
        const impuestos = await ImpuestoController.service.findAll({
            order: [['nombre', 'ASC']]
        });

        return ApiResponse.success(res, {
            data: impuestos,
            route: ImpuestoController.routes,
            message: 'Impuestos obtenidos exitosamente'
        });
    });

    /**
     * Obtener impuestos activos y vigentes
     * Acepta query param ?tipo_carga_id= para filtrar por tipo de carga
     */
    static obtenerImpuestosActivos = catchErrors(async (req, res, next) => {
        const { tipo_carga_id } = req.query;
        
        const where = {
            activo: true
        };

        // Si se proporciona tipo_carga_id, filtrar por él o por impuestos generales (null)
        if (tipo_carga_id) {
            where[Op.or] = [
                { tipo_carga_id: tipo_carga_id },
                { tipo_carga_id: null }
            ];
        }

        const impuestos = await ImpuestoController.service.findAll({
            where,
            order: [['nombre', 'ASC']]
        });

        return ApiResponse.success(res, {
            data: impuestos,
            route: ImpuestoController.routes,
            message: 'Impuestos activos obtenidos exitosamente'
        });
    });

    /**
     * Obtener un impuesto por ID
     */
    static obtenerImpuestoPorId = catchErrors(async (req, res, next) => {
        const { id } = req.params;
        
        if (!id) {
            return ApiResponse.error(res, {
                error: 'El ID del impuesto es requerido',
                route: ImpuestoController.routes,
                status: 400
            });
        }

        const impuesto = await ImpuestoController.service.findById(id);

        if (!impuesto) {
            return ApiResponse.error(res, {
                error: 'Impuesto no encontrado',
                route: ImpuestoController.routes,
                status: 404
            });
        }

        return ApiResponse.success(res, {
            data: impuesto,
            route: ImpuestoController.routes,
            message: 'Impuesto obtenido exitosamente'
        });
    });

    /**
     * Crear un nuevo impuesto
     */
    static crearImpuesto = catchErrors(async (req, res, next) => {
        const {
            tipo_carga_id = null,
            nombre,
            codigo,
            tipo,
            valor,
            aplicable_a = 'subtotal_neto',
            es_acumulativo = false,
            vigencia_desde,
            vigencia_hasta,
            activo = true
        } = req.body;

        // Validaciones básicas
        if (!nombre || !codigo || !tipo || valor === undefined || !vigencia_desde) {
            return ApiResponse.error(res, {
                error: 'Faltan parámetros obligatorios: nombre, codigo, tipo, valor, vigencia_desde',
                route: ImpuestoController.routes,
                status: 400
            });
        }

        if (!['porcentaje', 'monto_fijo'].includes(tipo)) {
            return ApiResponse.error(res, {
                error: 'El tipo debe ser "porcentaje" o "monto_fijo"',
                route: ImpuestoController.routes,
                status: 400
            });
        }

        if (!['subtotal_neto', 'total_bruto', 'tarifa_base'].includes(aplicable_a)) {
            return ApiResponse.error(res, {
                error: 'aplicable_a debe ser "subtotal_neto", "total_bruto" o "tarifa_base"',
                route: ImpuestoController.routes,
                status: 400
            });
        }

        const impuesto = await ImpuestoController.service.create({
            tipo_carga_id,
            nombre,
            codigo,
            tipo,
            valor,
            aplicable_a,
            es_acumulativo,
            vigencia_desde,
            vigencia_hasta,
            activo
        });

        return ApiResponse.success(res, {
            data: impuesto,
            route: ImpuestoController.routes,
            message: 'Impuesto creado exitosamente',
            status: 201
        });
    });

    /**
     * Actualizar un impuesto
     */
    static actualizarImpuesto = catchErrors(async (req, res, next) => {
        const { id } = req.params;
        const {
            tipo_carga_id,
            nombre,
            codigo,
            tipo,
            valor,
            aplicable_a,
            es_acumulativo,
            vigencia_desde,
            vigencia_hasta,
            activo
        } = req.body;

        if (!id) {
            return ApiResponse.error(res, {
                error: 'El ID del impuesto es requerido',
                route: ImpuestoController.routes,
                status: 400
            });
        }

        // Validar que exista el impuesto
        const impuestoExistente = await ImpuestoController.service.findById(id);
        if (!impuestoExistente) {
            return ApiResponse.error(res, {
                error: 'Impuesto no encontrado',
                route: ImpuestoController.routes,
                status: 404
            });
        }

        // Construir objeto de actualización
        const datosActualizar = {};
        if (tipo_carga_id !== undefined) datosActualizar.tipo_carga_id = tipo_carga_id;
        if (nombre !== undefined) datosActualizar.nombre = nombre;
        if (codigo !== undefined) datosActualizar.codigo = codigo;
        if (tipo !== undefined) {
            if (!['porcentaje', 'monto_fijo'].includes(tipo)) {
                return ApiResponse.error(res, {
                    error: 'El tipo debe ser "porcentaje" o "monto_fijo"',
                    route: ImpuestoController.routes,
                    status: 400
                });
            }
            datosActualizar.tipo = tipo;
        }
        if (valor !== undefined) datosActualizar.valor = valor;
        if (aplicable_a !== undefined) {
            if (!['subtotal_neto', 'total_bruto', 'tarifa_base'].includes(aplicable_a)) {
                return ApiResponse.error(res, {
                    error: 'aplicable_a debe ser "subtotal_neto", "total_bruto" o "tarifa_base"',
                    route: ImpuestoController.routes,
                    status: 400
                });
            }
            datosActualizar.aplicable_a = aplicable_a;
        }
        if (es_acumulativo !== undefined) datosActualizar.es_acumulativo = es_acumulativo;
        if (vigencia_desde !== undefined) datosActualizar.vigencia_desde = vigencia_desde;
        if (vigencia_hasta !== undefined) datosActualizar.vigencia_hasta = vigencia_hasta;
        if (activo !== undefined) datosActualizar.activo = activo;

        const impuestoActualizado = await ImpuestoController.service.update(id, datosActualizar);

        return ApiResponse.success(res, {
            data: impuestoActualizado,
            route: ImpuestoController.routes,
            message: 'Impuesto actualizado exitosamente'
        });
    });

    /**
     * Eliminar un impuesto (soft delete)
     */
    static eliminarImpuesto = catchErrors(async (req, res, next) => {
        const { id } = req.params;

        if (!id) {
            return ApiResponse.error(res, {
                error: 'El ID del impuesto es requerido',
                route: ImpuestoController.routes,
                status: 400
            });
        }

        // Validar que exista el impuesto
        const impuesto = await ImpuestoController.service.findById(id);
        if (!impuesto) {
            return ApiResponse.error(res, {
                error: 'Impuesto no encontrado',
                route: ImpuestoController.routes,
                status: 404
            });
        }

        await ImpuestoController.service.delete(id);

        return ApiResponse.success(res, {
            data: { id },
            route: ImpuestoController.routes,
            message: 'Impuesto eliminado exitosamente'
        });
    });
}

module.exports = ImpuestoController;
