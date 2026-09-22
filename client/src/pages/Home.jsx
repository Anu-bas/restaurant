import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/client';
import RestaurantCard from '../components/RestaurantCard.jsx';
import FoodCard from '../components/FoodCard.jsx';
import TableCard from '../components/TableCard.jsx';
import BookingModal from '../components/BookingModal.jsx';
import { CardSkeletons } from '../components/Loading.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const HERO =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=80';

const Home = () => {
  const [data, setData] = useState({ restaurants: [], foods: [], tables: [] });
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/restaurants'), api.get('/menu?available=true'), api.get('/tables')])
      .then(([r, m, t]) =>
        setData({
          restaurants: r.data.slice(0, 3),
          foods: m.data.slice(0, 6),
          tables: t.data.slice(0, 3),
        })
      )
      .catch(() => toast.error('Could not load the homepage. Is the API server running?'))
      .finally(() => setLoading(false));
  }, []);

  const startBooking = (table) => {
    if (!isLoggedIn) {
      toast.warning('Please login to continue.');
      return navigate('/login', { state: { from: '/tables' } });
    }
    if (isAdmin) return toast.info('Reservations are made from customer accounts.');
    setSelectedTable(table);
  };

  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${HERO})` }}>
        <div className="container">
          <div className="hero-inner">
            <h1>Dinner sorted in two taps: pick the food, hold the table.</h1>
            <p>
              Four kitchens under one roof in Madurai. Browse tonight's menus, fill your cart, and
              reserve the table you actually want to sit at.
            </p>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <Link to="/restaurants" className="btn btn-brass btn-lg">
                Explore restaurants
              </Link>
              <Link to="/tables" className="btn btn-outline-light btn-lg">
                Book a table
              </Link>
            </div>
            <span className="hero-hours">Kitchens open daily, 11:00 AM – 11:30 PM</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <h2>Our restaurants</h2>
              <p className="lead-muted mb-0">
                Each kitchen keeps its own menu, its own tables and its own opening hours.
              </p>
            </div>
            <Link to="/restaurants" className="btn btn-ghost">
              See all
            </Link>
          </div>
          {loading ? (
            <CardSkeletons count={3} />
          ) : (
            <div className="row g-4">
              {data.restaurants.map((r) => (
                <div className="col-12 col-sm-6 col-lg-4" key={r._id}>
                  <RestaurantCard restaurant={r} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <h2>Ordered most this week</h2>
              <p className="lead-muted mb-0">Add anything here to your cart and pay at the table.</p>
            </div>
            <Link to="/menu" className="btn btn-ghost">
              Full menu
            </Link>
          </div>
          {loading ? (
            <CardSkeletons count={3} />
          ) : (
            <div className="row g-4">
              {data.foods.map((f) => (
                <div className="col-12 col-sm-6 col-lg-4" key={f._id}>
                  <FoodCard food={f} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <h2>Tables open tonight</h2>
              <p className="lead-muted mb-0">
                Pick a seat by size and section — garden, rooftop or a private cabin.
              </p>
            </div>
            <Link to="/tables" className="btn btn-ghost">
              All tables
            </Link>
          </div>
          {loading ? (
            <CardSkeletons count={3} />
          ) : (
            <div className="row g-4">
              {data.tables.map((t) => (
                <div className="col-12 col-sm-6 col-lg-4" key={t._id}>
                  <TableCard table={t} onBook={startBooking} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <BookingModal
        table={selectedTable}
        show={Boolean(selectedTable)}
        onHide={() => setSelectedTable(null)}
      />
    </>
  );
};

export default Home;
