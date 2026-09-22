import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from './Loading.jsx';

// Customer-only pages: cart, reservations, profile
export const CustomerRoute = ({ children }) => {
  const { loading, isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <Loading label="Checking your session" />;
  if (!isLoggedIn) {
    toast.warning('Please login to continue.');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (isAdmin) return <Navigate to="/admin" replace />;
  return children;
};

// Admin-only pages
export const AdminRoute = ({ children }) => {
  const { loading, isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <Loading label="Checking your session" />;
  if (!isLoggedIn || !isAdmin) {
    toast.warning('Sign in with an admin account to open this page.');
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};
