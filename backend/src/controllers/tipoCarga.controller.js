const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { TipoCarga } = require('../models');

class TipoCargarController {
    // Instanciamos la clase genérica CRUDService
    static service = new CrudService(TipoCarga);
    static routes = '/tipo-carga';

    static save = catchErrors(async (req, res, next) => {
        const isUniqueName = await this.service.isUnique('nombre', req.body.nombre);
        if (isUniqueName === false) {
            return ApiResponse.error(res, {
                error: 'El nombre del tipo de carga ya existe, ingrese otro nombre',
                route: this.routes,
                status: 409
            });
        }
        const dataCreate = await this.service.create(req.body);
        if (dataCreate) {
            return ApiResponse.success(res, { data: dataCreate, route: this.routes, message: 'Tipo de carga created' });
        }
        return ApiResponse.error(res, { dataCreate, route: this.routes });
    });

    static update = catchErrors(async (req, res, next) => {
        const isUniqueForUpdate = await this.service.isUniqueForUpdate(req.params.id, 'nombre', req.body.nombre);
        if (isUniqueForUpdate === false) {
            return ApiResponse.error(res, {
                error: 'El nombre del tipo de carga ya existe, ingrese otro nombre',
                route: this.routes,
                status: 409
            });
        }
        const dataUpdate = await this.service.update(req.params.id, req.body);
        if (dataUpdate) {
            return ApiResponse.success(res, { data: dataUpdate, route: this.routes, message: 'Tipo de carga updated' });
        }
        return ApiResponse.error(res, { error: 'Error updating tipo de carga', route: this.routes });
    });

    static getAll = catchErrors(async (req, res, next) => {
        const data = await this.service.findAll();
        return ApiResponse.success(res, { data, route: this.routes, message: 'Tipos de carga list' });
    });

    static getById = catchErrors(async (req, res, next) => {
        const data = await this.service.findById(req.params.id);
        if (data) {
            return ApiResponse.success(res, { data, route: this.routes });
        }
        return ApiResponse.error(res, { error: 'Tipo de carga not found', route: this.routes, status: 404 });
    });

    static destroy = catchErrors(async (req, res, next) => {
        const success = await this.service.delete(req.params.id);
        if (success) {
            return ApiResponse.success(res, { route: this.routes, message: 'Tipo de carga deleted' });
        }
        return ApiResponse.error(res, { error: 'Tipo de carga not found', route: this.routes, status: 404 });
    });
}

module.exports = TipoCargarController;
