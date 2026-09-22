import { Spinner } from 'react-bootstrap';

export const Loading = ({ label = 'Loading' }) => (
  <div className="text-center py-5">
    <Spinner animation="border" role="status" style={{ color: 'var(--forest)' }} />
    <p className="meta mt-2 mb-0">{label}</p>
  </div>
);

export const CardSkeletons = ({ count = 3 }) => (
  <div className="row g-4">
    {Array.from({ length: count }).map((_, i) => (
      <div className="col-12 col-sm-6 col-lg-4" key={i}>
        <div className="skeleton" />
      </div>
    ))}
  </div>
);

export default Loading;
