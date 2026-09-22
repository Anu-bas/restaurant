import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page">
    <div className="container text-center py-5">
      <h1>That page is not on the menu</h1>
      <p className="lead-muted mx-auto">The link may be old, or the page has moved.</p>
      <Link to="/" className="btn btn-brand mt-3">
        Back to home
      </Link>
    </div>
  </div>
);

export default NotFound;
