import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { errorMessage } from '../../api/client';
import Loading from '../../components/Loading.jsx';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/stats')
      .then(({ data }) => setStats(data))
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading dashboard" />;
  if (!stats) return null;

  const cards = [
    { label: 'Restaurants', value: stats.restaurants, to: '/admin/restaurants' },
    { label: 'Food items', value: stats.foods, to: '/admin/food' },
    { label: 'Tables', value: stats.tables, to: '/admin/tables' },
    { label: 'Reservations', value: stats.reservations, to: '/admin/reservations' },
    { label: 'Awaiting confirmation', value: stats.pending, to: '/admin/reservations' },
    { label: 'Registered customers', value: stats.customers, to: '/admin/reservations' },
  ];

  return (
    <>
      <h1>Dashboard</h1>
      <p className="lead-muted">Everything running across the four kitchens right now.</p>

      <div className="row g-3 mt-2">
        {cards.map((c) => (
          <div className="col-6 col-lg-4" key={c.label}>
            <Link to={c.to} className="text-decoration-none">
              <div className="stat-card">
                <div className="stat-value">{c.value}</div>
                <p className="stat-label">{c.label}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <h2 className="mt-5 mb-3">Latest reservations</h2>
      {stats.recent.length === 0 ? (
        <p className="lead-muted">No bookings have come in yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Table</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((r) => (
                <tr key={r._id}>
                  <td>{r.customerName}</td>
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
    </>
  );
};

export default Dashboard;
