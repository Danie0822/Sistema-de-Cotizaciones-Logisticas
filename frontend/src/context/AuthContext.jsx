import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logout, getToken } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuthErrorHandler } from '../hooks/useAuthErrorHandler';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configurar el manejador de errores de autenticación
  useAuthErrorHandler(setUser);

  // Verificar si hay usuario y token válidos al cargar la app
  useEffect(() => {
    const initializeAuth = () => {
      const token = getToken();
      const currentUser = getCurrentUser();
      
      if (token && currentUser) {
        setUser(currentUser);
      } else {
        // Si no hay token o usuario, limpiar todo
        logout();
        setUser(null);
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    const token = getToken();
    return !!(token && user);
  };

  const signIn = (userData) => {
    setUser(userData);
  };

  const signOut = () => {
    logout(); // Limpia token del localStorage
    setUser(null);
    navigate('/login', { replace: true });
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto de auth
export function useAuth() {
  return useContext(AuthContext);
}
