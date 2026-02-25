
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import useConfirmDialog from './alerts/ConfirmDialog.js';

const links = [
  { to: '/clientes', label: 'Clientes', icon: 'bi-people' },
  { to: '/descuentos', label: 'Descuentos', icon: 'bi-percent' },
  { to: '/impuestos', label: 'Impuestos', icon: 'bi-receipt' },
  { to: '/tiposCarga', label: 'Tipos de Carga', icon: 'bi-box-seam' },
  { to: '/unidadesMedida', label: 'Unidades de Medida', icon: 'bi-rulers' },
  { to: '/reglasCargo', label: 'Reglas de Cargo', icon: 'bi-gear' },
  { to: '/tarifasBase', label: 'Tarifas Base', icon: 'bi-cash-stack' },
  { to: '/cotizaciones', label: 'Cotizaciones', icon: 'bi-file-earmark-text' },
];



export default function Sidebar() {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Confirmación de cierre de sesión reutilizable
  const confirmSignOut = useConfirmDialog({
    onConfirm: () => {
      signOut();
      navigate('/login');
    },
    title: '¿Cerrar sesión?',
    text: '¿Estás seguro que deseas salir?',
    confirmText: 'Sí, salir',
    cancelText: 'Cancelar',
    icon: 'warning',
  });

  return (
    <nav
      className="d-flex flex-column flex-shrink-0 bg-white border-end position-fixed top-0 start-0 h-100 shadow-sm"
      style={{ width: 240, zIndex: 1040, minHeight: '100vh' }}
    >
      <div className="d-flex align-items-center gap-2 mb-4 px-4 pt-4">
        <i className="bi bi-box fs-3 text-primary"></i>
        <span className="fs-5 fw-bold text-dark">Logistics Solutions</span>
      </div>
      <ul className="nav flex-column px-2 mb-auto gap-1">
        {links.map(link => {
          const isActive = pathname.startsWith(link.to);
          return (
            <li className="nav-item" key={link.to}>
              <Link
                to={link.to}
                className={`nav-link d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-semibold ${isActive ? 'active' : 'text-secondary'}`}
                style={{ fontSize: '1.07rem', background: isActive ? 'rgba(13,110,253,0.10)' : 'transparent', color: isActive ? '#0d6efd' : undefined, fontWeight: isActive ? 600 : 500 }}
              >
                <i className={`bi ${link.icon} fs-5 ${isActive ? 'text-primary' : 'text-secondary'}`}></i>
                <span>{link.label}</span>
                {isActive && <i className="bi bi-chevron-right ms-auto text-primary"></i>}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto px-4 pb-4">
        <hr />
        <div className="mb-2 small text-muted text-truncate d-flex align-items-center" title={user?.full_name}>
          <i className="bi bi-person-circle me-2 fs-5"></i>
          <span className="flex-grow-1">{user?.full_name}</span>
          <span className="badge bg-light text-secondary ms-2">{user?.rol}</span>
        </div>
        <button className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center gap-2 mt-2" onClick={confirmSignOut}>
          <i className="bi bi-box-arrow-right"></i>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
