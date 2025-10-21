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

// Componente para proteger rutas - solo admin puede acceder
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user && user.rol === 'admin' ? children : <Navigate to="/login" />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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
      {/* Cualquier ruta no encontrada va al dashboard */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
