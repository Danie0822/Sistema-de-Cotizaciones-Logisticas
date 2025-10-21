import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logout } from '../api/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Verificar si hay usuario guardado al cargar la app
  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const signIn = (userData) => {
    setUser(userData);
  };

  const signOut = () => {
    logout(); // Limpia token del localStorage
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto de auth
export function useAuth() {
  return useContext(AuthContext);
}
