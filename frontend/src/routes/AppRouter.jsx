import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Clientes from '../pages/Clientes';
import Descuentos from '../pages/Descuentos';
import TiposCarga from '../pages/TiposCarga';
import UnidadesMedida from '../pages/UnidadesMedida';
import ReglasCargo from '../pages/ReglasCargo';
import TarifasBase from '../pages/TarifasBase';
import Cotizaciones from '../pages/Cotizaciones';
import Layout from '../components/Layout';

// Componente para proteger rutas
function PrivateRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si no tiene rol de admin, redirigir al login
  if (!user || user.rol !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Componente para rutas públicas (como login)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default function AppRouter() {
  const { loading } = useAuth();

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Ruta pública de login */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      
      {/* Rutas protegidas dentro del layout */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes/*" element={<Clientes />} />
        <Route path="/descuentos/*" element={<Descuentos />} />
        <Route path="/tiposCarga/*" element={<TiposCarga />} />
        <Route path="/unidadesMedida/*" element={<UnidadesMedida />} />
        <Route path="/reglasCargo/*" element={<ReglasCargo />} />
        <Route path="/tarifasBase" element={<TarifasBase />} />
        <Route path="/tarifasBase/:clientId" element={<TarifasBase />} />
        <Route path="/cotizaciones/*" element={<Cotizaciones />} />
      </Route>
      
      {/* Cualquier ruta no encontrada - redirigir según el estado de autenticación */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
