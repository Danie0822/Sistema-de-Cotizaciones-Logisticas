import { crud } from '../api/api';
import api from '../api/api';

// Ruta base para Cotizaciones
const basePath = '/cotizaciones';

export const cotizacionesService = {
  // Obtener todas las cotizaciones
  getAll: () => crud.get(basePath),

  // Crear cotización y obtener PDF
  crearCotizacionPDF: (data, config = {}) =>
    api.post(`${basePath}/crear`, data, { ...config, responseType: 'blob' }),

  // Generar PDF de reporte detallado
  generarReportePDF: (cotizacionId, data = {}, config = {}) =>
    api.post(`${basePath}/reporte/${cotizacionId}/pdf`, data, { ...config, responseType: 'blob' }),
};
