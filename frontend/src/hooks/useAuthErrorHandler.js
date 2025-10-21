// Hook personalizado para manejar errores de autenticación
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthErrorHandler, logout } from '../api/api';

export function useAuthErrorHandler(setUser = null) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthError = () => {
      // Limpiar datos de autenticación
      logout();
      
      // Actualizar el estado del usuario si se proporciona la función
      if (setUser) {
        setUser(null);
      }
      
      // Redirigir al login
      navigate('/login', { replace: true });
    };

    // Configurar el manejador de errores en el interceptor de axios
    setAuthErrorHandler(handleAuthError);

    // Cleanup function para remover el handler cuando el componente se desmonte
    return () => {
      setAuthErrorHandler(null);
    };
  }, [navigate, setUser]);
}