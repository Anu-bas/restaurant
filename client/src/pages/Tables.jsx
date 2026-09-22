import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { errorMessage } from '../api/client';
import TableCard from '../components/TableCard.jsx';
import BookingModal from '../components/BookingModal.jsx';
import { CardSkeletons } from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({ restaurant: '', guests: '' });
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/tables'), api.get('/restaurants')])
      .then(([t, r]) => {
        setTables(t.data);
        setRestaurants(r.data);
      })
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const list = useMemo(
    () =>
      tables.filter(
        (t) =>
          (!filters.restaurant || t.restaurant?._id === filters.restaurant) &&
          (!filters.guests || t.capacity >= Number(filters.guests))
      ),
    [tables, filters]
  );

  const startBooking = (table) => {
    if (!isLoggedIn) {
      toast.warning('Please login to continue.');
      return navigate('/login', { state: { from: '/tables' } });
    }
    if (isAdmin) return toast.info('Reservations are made from customer accounts.');
    setSelectedTable(table);
  };

  return (
    <div className="page">
      <div className="container">
        <h1>Reserve a table</h1>
        <p className="lead-muted">
          Tables are held for 20 minutes past your booking time. Pick a section you like.
        </p>

        <div className="row g-3 my-4">
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="restaurant">Restaurant</label>
            <select
              id="restaurant"
              className="form-select"
              value={filters.restaurant}
              onChange={(e) => setFilters({ ...filters, restaurant: e.target.value })}
            >
              <option value="">All restaurants</option>
              {restaurants.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="guests">Party size</label>
            <select
              id="guests"
              className="form-select"
              value={filters.guests}
              onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
            >
              <option value="">Any size</option>
              {[2, 4, 6, 8].map((n) => (
                <option key={n} value={n}>
                  {n}+ guests
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <CardSkeletons count={6} />
        ) : list.length === 0 ? (
          <EmptyState
            title="No table fits that filter"
            body="Try a smaller party size or another restaurant."
          />
        ) : (
          <div className="row g-4">
            {list.map((t) => (
              <div className="col-12 col-sm-6 col-lg-4" key={t._id}>
                <TableCard table={t} onBook={startBooking} />
              </div>
            ))}
          </div>
        )}
      </div>

      <BookingModal
        table={selectedTable}
        show={Boolean(selectedTable)}
        onHide={() => setSelectedTable(null)}
      />
    </div>
  );
};

export default Tables;
