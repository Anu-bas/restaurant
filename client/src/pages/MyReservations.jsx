import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api, { errorMessage } from '../api/client';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const statusVariant = { Pending: 'warning', Confirmed: 'success', Cancelled: 'secondary' };

const MyReservations = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toCancel, setToCancel] = useState(null);

  const load = () =>
    api
      .get('/reservations/my')
      .then(({ data }) => setList(data))
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const cancel = async () => {
    try {
      await api.put(`/reservations/my/${toCancel._id}/cancel`);
      toast.success('Reservation cancelled');
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setToCancel(null);
    }
  };

  if (loading) return <Loading label="Loading your reservations" />;

  return (
    <div className="page">
      <div className="container">
        <h1>My reservations</h1>
        <p className="lead-muted">Every table you have booked, newest first.</p>

        {list.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No reservations yet"
              body="Pick a table and the booking will show up here."
              action={
                <Link to="/tables" className="btn btn-brand mt-3">
                  Browse tables
                </Link>
              }
            />
          </div>
        ) : (
          <div className="table-wrap mt-4">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Table</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r._id}>
                    <td>{r.restaurant?.name}</td>
                    <td>
                      {r.table?.tableNumber}
                      <span className="meta d-block">{r.table?.section}</span>
                    </td>
                    <td>{r.date}</td>
                    <td>{r.time}</td>
                    <td>{r.guests}</td>
                    <td>
                      <Badge bg={statusVariant[r.status]}>{r.status}</Badge>
                    </td>
                    <td className="text-end">
                      {r.status !== 'Cancelled' && (
                        <button className="btn btn-ghost btn-sm" onClick={() => setToCancel(r)}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        show={Boolean(toCancel)}
        title="Cancel this reservation?"
        body="The table goes back into the pool for that time slot."
        confirmLabel="Cancel booking"
        onHide={() => setToCancel(null)}
        onConfirm={cancel}
      />
    </div>
  );
};

export default MyReservations;
