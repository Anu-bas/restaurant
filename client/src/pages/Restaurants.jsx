import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api, { errorMessage } from '../api/client';
import RestaurantCard from '../components/RestaurantCard.jsx';
import { CardSkeletons } from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/restaurants')
      .then(({ data }) => setRestaurants(data))
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const list = restaurants.filter((r) =>
    `${r.name} ${r.cuisine} ${r.address}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="container">
        <h1>Restaurants</h1>
        <p className="lead-muted">Four kitchens, each with its own menu and its own dining room.</p>

        <div className="my-4" style={{ maxWidth: '24rem' }}>
          <label className="form-label" htmlFor="search">
            Search by name, cuisine or area
          </label>
          <input
            id="search"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Biryani, Anna Nagar, Pan Asian…"
          />
        </div>

        {loading ? (
          <CardSkeletons count={6} />
        ) : list.length === 0 ? (
          <EmptyState
            title="No restaurant matches that search"
            body="Try a shorter word, or clear the search to see every kitchen."
            action={
              <button className="btn btn-brand mt-3" onClick={() => setSearch('')}>
                Clear search
              </button>
            }
          />
        ) : (
          <div className="row g-4">
            {list.map((r) => (
              <div className="col-12 col-sm-6 col-lg-4" key={r._id}>
                <RestaurantCard restaurant={r} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
