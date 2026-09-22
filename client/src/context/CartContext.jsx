import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import api, { errorMessage } from '../api/client';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);
const emptyCart = { items: [], total: 0, totalItems: 0 };

export const CartProvider = ({ children }) => {
  const { isCustomer } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isCustomer) return setCart(emptyCart);
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (err) {
      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  }, [isCustomer]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async (menuItemId, quantity = 1) => {
    const { data } = await api.post('/cart', { menuItemId, quantity });
    setCart(data);
    toast.success('Added to cart');
  };

  const setQuantity = async (menuItemId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${menuItemId}`, { quantity });
      setCart(data);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const removeItem = async (menuItemId) => {
    try {
      const { data } = await api.delete(`/cart/${menuItemId}`);
      setCart(data);
      toast.info('Removed from cart');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await api.delete('/cart');
      setCart(data);
      toast.info('Cart emptied');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const value = useMemo(
    () => ({ cart, loading, refresh, addItem, setQuantity, removeItem, clearCart }),
    [cart, loading, refresh]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
