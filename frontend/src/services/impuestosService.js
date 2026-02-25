import { crud } from '../api/api';

// Ruta base para Impuestos
const basePath = '/impuestos';

export const impuestosService = {
  // Obtener todos los impuestos
  getAll: () => crud.get(basePath),

  // Obtener impuestos activos y vigentes con filtro opcional por tipo de carga
  getActivos: (params = {}) => crud.get(`${basePath}/activos`, { params }),

  // Obtener un impuesto por ID
  getById: (id) => crud.get(`${basePath}/${id}`),

  // Crear nuevo impuesto
  create: (data) => crud.post(basePath, data),

  // Actualizar impuesto existente
  update: (id, data) => crud.put(`${basePath}/${id}`, data),

  // Eliminar impuesto
  delete: (id) => crud.delete(`${basePath}/${id}`)
};
