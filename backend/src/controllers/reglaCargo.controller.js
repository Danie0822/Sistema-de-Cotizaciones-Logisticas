const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { ReglaCargo } = require('../models');

class ReglaCargoController {
    // Instanciamos la clase genérica CRUDService
    static service = new CrudService(ReglaCargo);
    static routes = '/regla-cargo';
    static includes = [
        {
            association: 'tipoCarga',
            attributes: ['id', 'nombre']
        }
    ];

    static save = catchErrors(async (req, res, next) => {
        const dataCreate = await this.service.create(req.body);
        if (dataCreate) {
            return ApiResponse.success(res, { data: dataCreate, route: this.routes, message: 'Regla de cargo created' });
        }
        return ApiResponse.error(res, { dataCreate, route: this.routes });
    });

    static update = catchErrors(async (req, res, next) => {
        const dataUpdate = await this.service.update(req.params.id, req.body);
        if (dataUpdate) {
            return ApiResponse.success(res, { data: dataUpdate, route: this.routes, message: 'Regla de cargo updated' });
        }
        return ApiResponse.error(res, { error: 'Error updating regla de cargo', route: this.routes });
    });

    static getAll = catchErrors(async (req, res, next) => {
        const data = await this.service.findAll({
            include: this.includes
        });
        return ApiResponse.success(res, { data, route: this.routes, message: 'Reglas de cargo list' });
    });

    static getById = catchErrors(async (req, res, next) => {
        const data = await this.service.findById(req.params.id, {
            include: this.includes
        });
        if (data) {
            return ApiResponse.success(res, { data, route: this.routes });
        }
        return ApiResponse.error(res, { error: 'Regla de cargo not found', route: this.routes, status: 404 });
    });

    static destroy = catchErrors(async (req, res, next) => {
        const success = await this.service.delete(req.params.id);
        if (success) {
            return ApiResponse.success(res, { route: this.routes, message: 'Regla de cargo deleted' });
        }
        return ApiResponse.error(res, { error: 'Regla de cargo not found', route: this.routes, status: 404 });
    });

    static getByTipoCarga = catchErrors(async (req, res, next) => {
        const data = await this.service.findAll({
            where: { tipo_carga_id: req.params.tipoCargoId },
            order: [['orden', 'ASC']],
            include: this.includes
        });
        return ApiResponse.success(res, { data, route: this.routes, message: 'Reglas de cargo by tipo carga' });
    });
}

module.exports = ReglaCargoController;
