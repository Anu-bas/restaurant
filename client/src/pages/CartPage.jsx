import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../components/SafeImage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loading from '../components/Loading.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useCart } from '../context/CartContext.jsx';

const CartPage = () => {
  const { cart, loading, refresh, setQuantity, removeItem, clearCart } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading && cart.items.length === 0) return <Loading label="Opening your cart" />;

  return (
    <div className="page">
      <div className="container">
        <h1>Your cart</h1>
        <p className="lead-muted">
          Show this at the counter when you sit down. Nothing is charged online.
        </p>

        {cart.items.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Your cart is empty"
              body="Browse the menu and add a dish to get started."
              action={
                <Link to="/menu" className="btn btn-brand mt-3">
                  Open the menu
                </Link>
              }
            />
          </div>
        ) : (
          <div className="row g-4 mt-1">
            <div className="col-12 col-lg-8">
              {cart.items.map(({ menuItem, quantity, subtotal }) => (
                <div
                  key={menuItem._id}
                  className="d-flex gap-3 align-items-center p-3 mb-3"
                  style={{
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <SafeImage
                    src={menuItem.image}
                    alt={menuItem.name}
                    style={{ width: 92, height: 92, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div className="flex-grow-1 min-w-0">
                    <h3 className="card-title-lg mb-1">{menuItem.name}</h3>
                    <p className="meta mb-1">
                      {menuItem.restaurant?.name} · ₹{menuItem.price} each
                    </p>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-ghost btn-sm"
                        aria-label={`Reduce ${menuItem.name}`}
                        onClick={() => setQuantity(menuItem._id, quantity - 1)}
                      >
                        −
                      </button>
                      <span style={{ minWidth: '2ch', textAlign: 'center' }}>{quantity}</span>
                      <button
                        className="btn btn-ghost btn-sm"
                        aria-label={`Add one ${menuItem.name}`}
                        onClick={() => setQuantity(menuItem._id, quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-link btn-sm text-decoration-none ms-2"
                        style={{ color: 'var(--danger)' }}
                        onClick={() => removeItem(menuItem._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className="price">₹{subtotal}</span>
                </div>
              ))}
            </div>

            <div className="col-12 col-lg-4">
              <div
                className="p-4"
                style={{
                  background: '#fff',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-lg)',
                  position: 'sticky',
                  top: '5.5rem',
                }}
              >
                <h3 className="mb-3">Order summary</h3>
                <div className="d-flex justify-content-between mb-2">
                  <span className="meta">Items</span>
                  <span>{cart.totalItems}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                  <span className="fw-semibold">Total</span>
                  <span className="price">₹{cart.total}</span>
                </div>
                <p className="meta mt-3">
                  Payment happens at the restaurant — card, cash or UPI at the counter.
                </p>
                <Link to="/tables" className="btn btn-brand w-100 mt-2">
                  Reserve a table
                </Link>
                <button className="btn btn-ghost w-100 mt-2" onClick={() => setConfirmClear(true)}>
                  Empty cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        show={confirmClear}
        title="Empty your cart?"
        body="Every item will be removed. You can add them again from the menu."
        confirmLabel="Empty cart"
        onHide={() => setConfirmClear(false)}
        onConfirm={() => {
          clearCart();
          setConfirmClear(false);
        }}
      />
    </div>
  );
};

export default CartPage;
