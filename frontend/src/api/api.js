import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Obtiene el token JWT almacenado
function getToken() {
  return localStorage.getItem('token');
}

// Instancia de axios con interceptores para JWT
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Helper para extraer el .data.data de la respuesta
const extractData = (promise) =>
  promise.then(res => res.data.data);

// CRUD genérico
export const crud = {
  get: (url, params) => extractData(api.get(url, { params })),
  post: (url, data) => extractData(api.post(url, data)),
  put: (url, data) => extractData(api.put(url, data)),
  delete: (url) => extractData(api.delete(url)),
};

// Login
export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  const { token, user } = res.data.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return { token, user };
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Obtener usuario actual: retorna el objeto user parseado o null
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user && user !== "undefined" ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export default api;
