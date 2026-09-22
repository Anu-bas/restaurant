import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/reservations/my')
      .then(({ data }) => setReservations(data))
      .catch(() => {});
  }, []);

  const upcoming = reservations.filter((r) => r.status !== 'Cancelled').slice(0, 3);

  return (
    <div className="page">
      <div className="container">
        <h1>Hello, {user.name.split(' ')[0]}</h1>
        <p className="lead-muted">Your cart, your bookings and your details in one place.</p>

        <div className="row g-4 mt-1">
          <div className="col-12 col-md-4">
            <div className="stat-card">
              <div className="stat-value">{cart.totalItems}</div>
              <p className="stat-label">items in cart (₹{cart.total})</p>
              <Link to="/cart" className="btn btn-ghost btn-sm mt-3">
                Open cart
              </Link>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="stat-card">
              <div className="stat-value">{reservations.length}</div>
              <p className="stat-label">reservations made</p>
              <Link to="/my-reservations" className="btn btn-ghost btn-sm mt-3">
                My reservations
              </Link>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '1.3rem' }}>
                {user.email}
              </div>
              <p className="stat-label">{user.phone || 'No phone number saved'}</p>
              <Link to="/profile" className="btn btn-ghost btn-sm mt-3">
                Edit profile
              </Link>
            </div>
          </div>
        </div>

        <h2 className="mt-5 mb-3">Next up</h2>
        {upcoming.length === 0 ? (
          <p className="lead-muted">
            Nothing booked yet. <Link to="/tables">Pick a table</Link> for tonight.
          </p>
        ) : (
          <div className="table-wrap">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Table</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Guests</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((r) => (
                  <tr key={r._id}>
                    <td>{r.restaurant?.name}</td>
                    <td>{r.table?.tableNumber}</td>
                    <td>{r.date}</td>
                    <td>{r.time}</td>
                    <td>{r.guests}</td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          className="btn btn-ghost mt-4"
          onClick={() => {
            logout();
            toast.info('Signed out');
            navigate('/');
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
