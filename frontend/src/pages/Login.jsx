
import { useState } from 'react';
import { login } from '../api/api';
import { useAuth } from '../context/AuthContext.jsx';
import Swal from 'sweetalert2';
import TextField from '../components/inputs/TextField';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      console.log("Data ssss", data.user);
      if (data.user.rol !== 'admin') {
        Swal.fire('Acceso denegado', 'Solo usuarios admin pueden acceder.', 'error');
        return;
      }
      signIn(data.user);
      window.location.href = '/';
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.error || 'Credenciales inválidas', 'error');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)'}}>
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
          <div className="card shadow-lg border-0 rounded-4 p-0 overflow-hidden animate__animated animate__fadeIn">
            <div className="card-body p-4 p-md-5 d-flex flex-column align-items-center">
              <img src="/logo.png" alt="Logo Logistics Solutions" className="mb-4" style={{width: 80, height: 80, objectFit: 'contain'}} />
              <h1 className="card-title text-center mb-4 fw-bold" style={{ letterSpacing: 1.5, fontSize: '2rem' }}>Iniciar Sesión</h1>
              <form onSubmit={handleSubmit} autoComplete="off" className="w-100">
                <TextField
                  id="loginEmail"
                  label="Correo electrónico"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
                <TextField
                  id="loginPassword"
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <div className="d-grid mb-2 mt-4">
                  <button type="submit" className="btn btn-primary btn-lg rounded-3 fw-bold shadow-sm py-2">
                    Entrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
