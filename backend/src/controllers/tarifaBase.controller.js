const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { TarifaBase } = require('../models');
const { Op } = require('sequelize');

class TarifaBaseController {
    // Instanciamos la clase genérica CRUDService
    static service = new CrudService(TarifaBase);
    static routes = '/tarifa-base';
    static includes = [
        {
            association: 'cliente',
            attributes: ['id', 'nombre']
        },
        {
            association: 'tipoCarga',
            attributes: ['id', 'nombre']
        },
        {
            association: 'unidadMedida',
            attributes: ['id', 'codigo', 'descripcion']
        }
    ];

    static save = catchErrors(async (req, res, next) => {
        const valideConstraints = await this.service.findAll({
            where: {
                cliente_id: req.body.cliente_id,
                tipo_carga_id: req.body.tipo_carga_id,
                unidad_id: req.body.unidad_id
            }
        });
        // Validamos si ya existe una tarifa base con los mismos parámetros
        if (valideConstraints.length > 0) {
            return ApiResponse.error(res, { error: 'Tarifa base del cliente ya existe con los mismos parámetros', route: this.routes, status: 409 });
        }
        const dataCreate = await this.service.create(req.body);
        if (dataCreate) {
            return ApiResponse.success(res, { data: dataCreate, route: this.routes, message: 'Tarifa base created' });
        }
        return ApiResponse.error(res, { dataCreate, route: this.routes });
    });


    static update = catchErrors(async (req, res, next) => {
        const valideConstraints = await this.service.findAll({
            where: {
                cliente_id: req.body.cliente_id,
                tipo_carga_id: req.body.tipo_carga_id,
                unidad_id: req.body.unidad_id,
                id: { [Op.ne]: req.params.id }
            }
        });
        // Validamos si ya existe una tarifa base con los mismos parámetros
        if (valideConstraints.length > 0) {
            return ApiResponse.error(res, { error: 'Tarifa base del cliente ya existe con los mismos parámetros', route: this.routes, status: 409 });
        }
        const dataUpdate = await this.service.update(req.params.id, req.body);
        if (dataUpdate) {
            return ApiResponse.success(res, { data: dataUpdate, route: this.routes, message: 'Tarifa base updated' });
        }
        return ApiResponse.error(res, { error: 'Error updating tarifa base', route: this.routes });
    });

    static getAll = catchErrors(async (req, res, next) => {
        const data = await this.service.findAll({
            include: this.includes
        });
        return ApiResponse.success(res, { data, route: this.routes, message: 'Tarifas base list' });
    });

    static getById = catchErrors(async (req, res, next) => {
        const data = await this.service.findById(req.params.id, {
            include: this.includes
        });
        if (data) {
            return ApiResponse.success(res, { data, route: this.routes });
        }
        return ApiResponse.error(res, { error: 'Tarifa base not found', route: this.routes, status: 404 });
    });

    static destroy = catchErrors(async (req, res, next) => {
        const success = await this.service.delete(req.params.id);
        if (success) {
            return ApiResponse.success(res, { route: this.routes, message: 'Tarifa base deleted' });
        }
        return ApiResponse.error(res, { error: 'Tarifa base not found', route: this.routes, status: 404 });
    });

    static getByCliente = catchErrors(async (req, res, next) => {
        const data = await this.service.findAll({
            where: { cliente_id: req.params.clienteId },
            include: this.includes
        });
        return ApiResponse.success(res, { data, route: this.routes, message: 'Tarifas base by cliente' });
    });
}

module.exports = TarifaBaseController;
