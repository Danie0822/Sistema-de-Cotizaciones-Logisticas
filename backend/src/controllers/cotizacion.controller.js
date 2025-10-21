const CrudService = require('../services/crudService');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { Cotizacion, sequelize } = require('../models');
const GenerateCotizacionPDF = require('../reports/generators/generateCotizacionPDF');
const { includes } = require('zod/v4');
class CotizacionController {
    static service = new CrudService(Cotizacion);
    static routes = '/cotizacion';
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

    // Obtener info de cotizaciones
    static obtenerCotizaciones = catchErrors(async (req, res, next) => {
        const cotizaciones = await this.service.findAll(
            {
                include: this.includes,
                order: [['fecha_cotizacion', 'DESC']]
            }
        );

        return ApiResponse.success(res, {
            data: cotizaciones,
            route: this.routes,
            message: 'Cotizaciones obtenidas exitosamente'
        });
    });


    //Crea una cotización usando el stored procedure y retorna el PDF generado.
    
    static crearCotizacion = catchErrors(async (req, res, next) => {
        const { cliente_id, tipo_carga_id, unidad_id, peso, descuento_id, origen, destino, includeNotes = false, includeTerms = true, notes = null } = req.body;

        // Validación básica de parámetros
        if (!cliente_id || !tipo_carga_id || !unidad_id || !peso) {
            return ApiResponse.error(res, {
                error: 'Faltan parámetros obligatorios',
                route: this.routes,
                status: 400
            });
        }


        const result = await sequelize.query(
            'SELECT sp_cotizar_y_guardar(:p_cliente_id, :p_tipo_carga_id, :p_unidad_id, :p_peso, :p_origen, :p_destino, :p_descuento_id) AS cotizacion_id',
            {
                replacements: {
                    p_cliente_id: cliente_id,
                    p_tipo_carga_id: tipo_carga_id,
                    p_unidad_id: unidad_id,
                    p_peso: peso,
                    p_descuento_id: descuento_id || null,
                    p_origen: origen,
                    p_destino: destino
                },
                type: sequelize.QueryTypes.SELECT
            }
        );

        const cotizacionId = result[0]?.cotizacion_id;
        if (cotizacionId) {
            // Obtener datos de la cotización y enviar PDF
            return await CotizacionController._generarYEnviarPDF(res, cotizacionId, { includeNotes, includeTerms, notes });
        }

        return ApiResponse.error(res, {
            error: 'Error al crear la cotización o generar el reporte',
            route: this.routes,
            status: 500
        });
    });


    //Obtiene el reporte detallado de una cotización por ID.

    static getReporteDetallado = catchErrors(async (req, res, next) => {
        const { cotizacionId } = req.params;
        if (!cotizacionId) {
            return ApiResponse.error(res, {
                error: 'cotizacionId es requerido',
                route: this.routes,
                status: 400
            });
        }
        const reporte = await CotizacionController._getReporteCotizacionById(cotizacionId);
        if (reporte && reporte.length > 0) {
            return ApiResponse.success(res, {
                data: reporte,
                route: this.routes,
                status: 200
            });
        }
        return ApiResponse.error(res, {
            error: 'No se encontró la cotización especificada',
            route: this.routes,
            status: 404
        });
    });


    //Obtiene el reporte completo (todas las cotizaciones).
    static getReporteCompleto = catchErrors(async (req, res, next) => {
        const reporte = await CotizacionController._getReporteCotizacionById();
        if (!reporte || reporte.length === 0) {
            return ApiResponse.error(res, {
                error: 'No hay datos disponibles para el reporte completo',
                route: this.routes,
                status: 404
            });
        }
        return ApiResponse.success(res, {
            data: reporte,
            route: this.routes,
            message: 'Reporte completo obtenido exitosamente'
        });
    });

    //Genera y envía el PDF del reporte detallado de una cotización.

    static getReporteDetalladoPDF = catchErrors(async (req, res, next) => {
        const { cotizacionId } = req.params;
        const { includeNotes, includeTerms, notes } = req.body;
        if (!cotizacionId) {
            return ApiResponse.error(res, {
                error: 'cotizacionId es requerido',
                route: this.routes,
                status: 400
            });
        }
        return await CotizacionController._generarYEnviarPDF(res, cotizacionId, { includeNotes, includeTerms, notes });
    });

    /**
     * Método privado para obtener el reporte de cotización por ID o completo.
     * @param {number} [cotizacionId]
     * @returns {Promise<Array>}
     */
    static _getReporteCotizacionById = async (cotizacionId) => {
        let whereClause = '';
        const replacements = {};
        if (cotizacionId) {
            whereClause = 'WHERE cotizacion_id = :cotizacionId';
            replacements.cotizacionId = cotizacionId;
        }
        const query = `
            SELECT * FROM vw_cotizaciones_reporte_detallado
            ${whereClause}
            ORDER BY cotizacion_id, tipo_detalle
        `;
        return await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });
    }

    /**
     * Método privado para generar el PDF y enviarlo como respuesta HTTP.
     * @param {object} res
     * @param {number} cotizacionId
     * @param {object} opciones
     */
    static _generarYEnviarPDF = async (res, cotizacionId, opciones = {}) => {
        const options = {
            includeNotes: opciones.includeNotes || false,
            includeTerms: opciones.includeTerms !== false, // Por defecto true
            notes: opciones.notes || null
        };
        const reporte = await CotizacionController._getReporteCotizacionById(cotizacionId);
        if (!reporte || reporte.length === 0) {
            return ApiResponse.error(res, {
                error: cotizacionId ? 'No se encontró la cotización especificada' : 'No hay datos disponibles para el reporte',
                route: CotizacionController.routes,
                status: 404
            });
        }
        // Generar PDF
        const pdfBuffer = await GenerateCotizacionPDF.generate(reporte, options);
        // Nombre del archivo
        const filename = `cotizacion_${cotizacionId || 'completo'}_${Date.now()}.pdf`;
        // Configurar headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        // Enviar PDF
        res.send(pdfBuffer);
    }
}

module.exports = CotizacionController;
