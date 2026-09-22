import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/restaurants', label: 'Restaurants' },
  { to: '/admin/food', label: 'Food' },
  { to: '/admin/tables', label: 'Tables' },
  { to: '/admin/reservations', label: 'Reservations' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="mb-4">
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', color: '#fff' }}>
            Thali &amp; Table
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.75 }}>Admin console</div>
        </div>
        <nav>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/">Back to site</NavLink>
        </nav>
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,.15)' }}>
          <p style={{ fontSize: '0.85rem', opacity: 0.8 }} className="mb-2">
            {user?.name}
          </p>
          <button
            className="btn btn-brass btn-sm"
            onClick={() => {
              logout();
              toast.info('Signed out');
              navigate('/admin/login');
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
