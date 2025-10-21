const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { Cliente } = require('../models');

class ClienteController {
    // Instanciamos la clase genérica CRUDService
    static service = new CrudService(Cliente);
    static routes = '/cliente';

    static save = catchErrors(async (req, res, next) => {
        const isUnique = await this.service.isUnique('contacto', req.body.contacto);
        if (isUnique === false) {
            return ApiResponse.error(res, {
                error: 'El contacto del cliente ya existe, ingrese otro contacto',
                route: this.routes,
                status: 409
            });
        }
        const dataCreate = await this.service.create(req.body);
        if (dataCreate) {
            return ApiResponse.success(res, { data: dataCreate, route: this.routes, message: 'Cliente created' });
        }
        return ApiResponse.error(res, { dataCreate, route: this.routes });
    });

    static update = catchErrors(async (req, res, next) => {
        const isUniqueForUpdate = await this.service.isUniqueForUpdate(req.params.id, 'contacto', req.body.contacto);
        if (isUniqueForUpdate === false) {
            return ApiResponse.error(res, {
                error: 'El contacto del cliente ya existe, ingrese otro contacto',
                route: this.routes,
                status: 409
            });
        }
        const dataUpdate = await this.service.update(req.params.id, req.body);
        if (dataUpdate) {
            return ApiResponse.success(res, { data: dataUpdate, route: this.routes, message: 'Cliente updated' });
        }
        return ApiResponse.error(res, { error: 'Error updating cliente', route: this.routes });
    });

    static getAll = catchErrors(async (req, res, next) => {
        const data = await this.service.findAll();
        return ApiResponse.success(res, { data, route: this.routes, message: 'Cliente list' });
    });

    static getById = catchErrors(async (req, res, next) => {
        const data = await this.service.findById(req.params.id);
        if (data) {
            return ApiResponse.success(res, { data, route: this.routes });
        }
        return ApiResponse.error(res, { error: 'Cliente not found', route: this.routes, status: 404 });
    });

    static destroy = catchErrors(async (req, res, next) => {
        const success = await this.service.delete(req.params.id);
        if (success) {
            return ApiResponse.success(res, { route: this.routes, message: 'Cliente deleted' });
        }
        return ApiResponse.error(res, { error: 'Cliente not found', route: this.routes, status: 404 });
    });
}

module.exports = ClienteController;
