import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SafeImage from './SafeImage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { errorMessage } from '../api/client';

const FoodCard = ({ food }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!isLoggedIn) {
      toast.warning('Please login to continue.');
      return navigate('/login', { state: { from: '/menu' } });
    }
    if (isAdmin) return toast.info('Carts belong to customer accounts.');
    setBusy(true);
    try {
      await addItem(food._id, qty);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="card-plain">
      <SafeImage src={food.image} alt={food.name} className="card-media" />
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h3 className="card-title-lg">{food.name}</h3>
          <span className="price">₹{food.price}</span>
        </div>
        <p className="meta">
          <span className="tag">{food.category}</span>{' '}
          {food.restaurant?.name && <span className="ms-1">{food.restaurant.name}</span>}
        </p>
        {food.description && <p style={{ fontSize: '0.93rem' }}>{food.description}</p>}
        {food.isAvailable ? (
          <div className="d-flex align-items-center gap-2 mt-auto">
            <label className="visually-hidden" htmlFor={`qty-${food._id}`}>
              Quantity
            </label>
            <select
              id={`qty-${food._id}`}
              className="form-select"
              style={{ width: '5rem' }}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <button className="btn btn-brand flex-grow-1" onClick={add} disabled={busy}>
              {busy ? 'Adding…' : 'Add to cart'}
            </button>
          </div>
        ) : (
          <span className="tag tag-closed mt-auto align-self-start">Sold out today</span>
        )}
      </div>
    </article>
  );
};

export default FoodCard;
