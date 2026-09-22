import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6';

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="row g-4">
        <div className="col-12 col-md-4">
          <h4>Thali &amp; Table</h4>
          <p style={{ maxWidth: '34ch' }}>
            Four kitchens, one booking desk. Browse the menus, build a cart and hold a table for
            tonight.
          </p>
          <div className="d-flex gap-3 mt-3 fs-5">
            <a href="https://facebook.com" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://twitter.com" aria-label="X"><FaXTwitter /></a>
            <a href="https://youtube.com" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <h4>Explore</h4>
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/menu">Food menu</Link>
          <Link to="/tables">Tables</Link>
          <Link to="/my-reservations">My reservations</Link>
        </div>
        <div className="col-6 col-md-2">
          <h4>Account</h4>
          <Link to="/login">Customer login</Link>
          <Link to="/register">Register</Link>
          <Link to="/admin/login">Admin login</Link>
        </div>
        <div className="col-12 col-md-3">
          <h4>Visit us</h4>
          <p className="mb-1">12 West Masi Street</p>
          <p className="mb-1">Madurai, Tamil Nadu 625001</p>
          <p className="mb-1">+91 98765 43210</p>
          <p className="mb-0">hello@thaliandtable.com</p>
        </div>
      </div>
      <div className="footer-base d-flex flex-wrap justify-content-between gap-2">
        <span>© {new Date().getFullYear()} Thali &amp; Table. All rights reserved.</span>
        <span>Open daily, 11:00 AM to 11:30 PM</span>
      </div>
    </div>
  </footer>
);

export default Footer;
