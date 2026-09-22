import { Container, Nav, Navbar as BsNavbar, NavDropdown } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const SiteNavbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    toast.info('Signed out');
    navigate('/');
  };

  return (
    <BsNavbar expand="lg" className="site-nav" variant="dark" sticky="top" collapseOnSelect>
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          Thali &amp; Table
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="main-nav" />
        <BsNavbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/restaurants">
              Restaurants
            </Nav.Link>
            <Nav.Link as={NavLink} to="/menu">
              Menu
            </Nav.Link>
            <Nav.Link as={NavLink} to="/tables">
              Tables
            </Nav.Link>
          </Nav>

          <Nav className="align-items-lg-center">
            {isAdmin && (
              <Nav.Link as={NavLink} to="/admin">
                Admin dashboard
              </Nav.Link>
            )}

            {!isAdmin && (
              <Nav.Link as={NavLink} to="/cart">
                Cart
                {cart.totalItems > 0 && <span className="cart-pill">{cart.totalItems}</span>}
              </Nav.Link>
            )}

            {isLoggedIn ? (
              <NavDropdown title={user.name.split(' ')[0]} id="account-menu" align="end">
                {!isAdmin && (
                  <>
                    <NavDropdown.Item as={Link} to="/dashboard">
                      My dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/my-reservations">
                      My reservations
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/profile">
                      Profile
                    </NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={signOut}>Sign out</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register">
                  Register
                </Nav.Link>
                <Nav.Link as={NavLink} to="/admin/login">
                  Admin
                </Nav.Link>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default SiteNavbar;
