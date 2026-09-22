import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { errorMessage } from '../api/client';
import SafeImage from '../components/SafeImage.jsx';
import FoodCard from '../components/FoodCard.jsx';
import TableCard from '../components/TableCard.jsx';
import BookingModal from '../components/BookingModal.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/restaurants/${id}`)
      .then(({ data }) => setData(data))
      .catch((err) => {
        toast.error(errorMessage(err));
        navigate('/restaurants');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const startBooking = (table) => {
    if (!isLoggedIn) {
      toast.warning('Please login to continue.');
      return navigate('/login', { state: { from: `/restaurants/${id}` } });
    }
    if (isAdmin) return toast.info('Reservations are made from customer accounts.');
    setSelectedTable(table);
  };

  if (loading) return <Loading label="Opening the restaurant" />;
  if (!data) return null;

  const { restaurant, menu, tables } = data;

  return (
    <div className="page">
      <div className="container">
        <div className="row g-4 align-items-center mb-5">
          <div className="col-12 col-lg-6">
            <SafeImage
              src={restaurant.image}
              alt={restaurant.name}
              className="w-100"
              style={{ borderRadius: 'var(--radius-lg)', aspectRatio: '16/10', objectFit: 'cover' }}
            />
          </div>
          <div className="col-12 col-lg-6">
            <span className="tag">{restaurant.cuisine}</span>
            <h1 className="mt-2">{restaurant.name}</h1>
            <p className="lead-muted">{restaurant.description}</p>
            <p className="meta mb-1">{restaurant.address}</p>
            <p className="meta">Open {restaurant.openingHours}</p>
          </div>
        </div>

        <h2 className="mb-3">Menu</h2>
        {menu.length === 0 ? (
          <EmptyState title="This kitchen has not published a menu yet" body="Check back shortly." />
        ) : (
          <div className="row g-4">
            {menu.map((f) => (
              <div className="col-12 col-sm-6 col-lg-4" key={f._id}>
                <FoodCard food={f} />
              </div>
            ))}
          </div>
        )}

        <h2 className="mt-5 mb-3">Tables</h2>
        {tables.length === 0 ? (
          <EmptyState title="No tables listed here yet" body="Try another restaurant for tonight." />
        ) : (
          <div className="row g-4">
            {tables.map((t) => (
              <div className="col-12 col-sm-6 col-lg-4" key={t._id}>
                <TableCard table={{ ...t, restaurant }} onBook={startBooking} />
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

export default RestaurantDetail;
