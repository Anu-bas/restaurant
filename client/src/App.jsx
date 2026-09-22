import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { AdminRoute, CustomerRoute } from './components/RouteGuards.jsx';

import Home from './pages/Home.jsx';
import Restaurants from './pages/Restaurants.jsx';
import RestaurantDetail from './pages/RestaurantDetail.jsx';
import Menu from './pages/Menu.jsx';
import Tables from './pages/Tables.jsx';
import CartPage from './pages/CartPage.jsx';
import MyReservations from './pages/MyReservations.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ManageRestaurants from './pages/admin/ManageRestaurants.jsx';
import ManageFood from './pages/admin/ManageFood.jsx';
import ManageTables from './pages/admin/ManageTables.jsx';
import ManageReservations from './pages/admin/ManageReservations.jsx';

const App = () => {
  const { pathname } = useLocation();
  const isAdminArea = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (isAdminArea) {
    return (
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="restaurants" element={<ManageRestaurants />} />
          <Route path="food" element={<ManageFood />} />
          <Route path="tables" element={<ManageTables />} />
          <Route path="reservations" element={<ManageReservations />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/cart"
            element={
              <CustomerRoute>
                <CartPage />
              </CustomerRoute>
            }
          />
          <Route
            path="/my-reservations"
            element={
              <CustomerRoute>
                <MyReservations />
              </CustomerRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <CustomerRoute>
                <CustomerDashboard />
              </CustomerRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <CustomerRoute>
                <Profile />
              </CustomerRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
