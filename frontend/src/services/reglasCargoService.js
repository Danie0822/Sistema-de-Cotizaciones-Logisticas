import { crud } from '../api/api';

const basePath = '/reglasCargo';

export const reglasCargoService = {
  getAll: () => crud.get(basePath),
  getById: (id) => crud.get(`${basePath}/${id}`),
  create: (data) => crud.post(basePath, data),
  update: (id, data) => crud.put(`${basePath}/${id}`, data),
  delete: (id) => crud.delete(`${basePath}/${id}`),
};
