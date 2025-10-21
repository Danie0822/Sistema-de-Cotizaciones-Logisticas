import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1" style={{ marginLeft: 260, minHeight: '100vh', background: '#f8f9fa' }}>
        <Outlet />
      </main>
    </div>
  );
}
