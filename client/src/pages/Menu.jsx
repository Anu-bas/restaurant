import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import api, { errorMessage } from '../api/client';
import FoodCard from '../components/FoodCard.jsx';
import { CardSkeletons } from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';

const CATEGORIES = ['Starter', 'Main Course', 'Biryani', 'Breads', 'Dessert', 'Beverage'];

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({ restaurant: '', category: '', search: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/menu'), api.get('/restaurants')])
      .then(([m, r]) => {
        setFoods(m.data);
        setRestaurants(r.data);
      })
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const list = useMemo(
    () =>
      foods.filter(
        (f) =>
          (!filters.restaurant || f.restaurant?._id === filters.restaurant) &&
          (!filters.category || f.category === filters.category) &&
          `${f.name} ${f.description}`.toLowerCase().includes(filters.search.toLowerCase())
      ),
    [foods, filters]
  );

  const change = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="page">
      <div className="container">
        <h1>Food menu</h1>
        <p className="lead-muted">
          Everything the four kitchens are cooking today. Add what you want to your cart and settle
          up at the table.
        </p>

        <div className="row g-3 my-4">
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="search">Search</label>
            <input
              id="search"
              name="search"
              className="form-control"
              value={filters.search}
              onChange={change}
              placeholder="Biryani, paneer, noodles…"
            />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label" htmlFor="restaurant">Restaurant</label>
            <select
              id="restaurant"
              name="restaurant"
              className="form-select"
              value={filters.restaurant}
              onChange={change}
            >
              <option value="">All restaurants</option>
              {restaurants.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label" htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={filters.category}
              onChange={change}
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <CardSkeletons count={6} />
        ) : list.length === 0 ? (
          <EmptyState
            title="Nothing matches those filters"
            body="Widen the search or switch back to all restaurants."
            action={
              <button
                className="btn btn-brand mt-3"
                onClick={() => setFilters({ restaurant: '', category: '', search: '' })}
              >
                Reset filters
              </button>
            }
          />
        ) : (
          <div className="row g-4">
            {list.map((f) => (
              <div className="col-12 col-sm-6 col-lg-4" key={f._id}>
                <FoodCard food={f} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
