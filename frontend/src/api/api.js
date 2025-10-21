import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Variable para almacenar la función de manejo de errores de auth
let authErrorHandler = null;

// Función para establecer el manejador de errores de autenticación
export function setAuthErrorHandler(handler) {
  authErrorHandler = handler;
}

// Obtiene el token JWT almacenado
export function getToken() {
  return localStorage.getItem('token');
}

// Instancia de axios con interceptores para JWT
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar token automaticamente a todas las requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la devolvemos
    return response;
  },
  (error) => {
    // Si el error es 401 (No autorizado), significa que el token expiró o es inválido
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      // Limpiar datos de autenticación
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Llamar al manejador de errores de autenticación si existe
      if (authErrorHandler) {
        authErrorHandler();
      }
    }
    
    // Propagar el error para que los componentes puedan manejarlo
    return Promise.reject(error);
  }
);
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
  // Guardar en localStorage para persistir sesion
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
