const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { UnidadMedida } = require('../models');

class UnidadMedidaController {
    // Instanciamos la clase genérica CRUDService
    static service = new CrudService(UnidadMedida);
    static routes = '/unidad-medida';

    static save = catchErrors(async (req, res, next) => {
        const isUnique = await this.service.isUnique('codigo', req.body.codigo);
        if (isUnique === false) {
            return ApiResponse.error(res, {
                error: 'El código de la unidad de medida ya existe, ingrese otro código',
                route: this.routes,
                status: 409
            });
        }
        const dataCreate = await this.service.create(req.body);
        if (dataCreate) {
            return ApiResponse.success(res, { data: dataCreate, route: this.routes, message: 'Unidad de medida created' });
        }
        return ApiResponse.error(res, { dataCreate, route: this.routes });
    });

    static update = catchErrors(async (req, res, next) => {
        const isUniqueForUpdate = await this.service.isUniqueForUpdate(req.params.id, 'codigo', req.body.codigo);
        if (isUniqueForUpdate === false) {
            return ApiResponse.error(res, {
                error: 'El código de la unidad de medida ya existe, ingrese otro código',
                route: this.routes,
                status: 409
            });
        }
        const dataUpdate = await this.service.update(req.params.id, req.body);
        if (dataUpdate) {
            return ApiResponse.success(res, { data: dataUpdate, route: this.routes, message: 'Unidad de medida updated' });
        }
        return ApiResponse.error(res, { error: 'Error updating unidad de medida', route: this.routes });
    });

    static getAll = catchErrors(async (req, res, next) => {
        const data = await this.service.findAll();
        return ApiResponse.success(res, { data, route: this.routes, message: 'Unidades de medida list' });
    });

    static getById = catchErrors(async (req, res, next) => {
        const data = await this.service.findById(req.params.id);
        if (data) {
            return ApiResponse.success(res, { data, route: this.routes });
        }
        return ApiResponse.error(res, { error: 'Unidad de medida not found', route: this.routes, status: 404 });
    });

    static destroy = catchErrors(async (req, res, next) => {
        const success = await this.service.delete(req.params.id);
        if (success) {
            return ApiResponse.success(res, { route: this.routes, message: 'Unidad de medida deleted' });
        }
        return ApiResponse.error(res, { error: 'Unidad de medida not found', route: this.routes, status: 404 });
    });
}

module.exports = UnidadMedidaController;
