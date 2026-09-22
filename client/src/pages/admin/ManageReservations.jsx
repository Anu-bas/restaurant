import { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api, { errorMessage } from '../../api/client';
import Loading from '../../components/Loading.jsx';
import EmptyState from '../../components/EmptyState.jsx';

const STATUSES = ['Pending', 'Confirmed', 'Cancelled'];
const variant = { Pending: 'warning', Confirmed: 'success', Cancelled: 'secondary' };

const ManageReservations = () => {
  const [list, setList] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = (filterStatus = status) => {
    setLoading(true);
    api
      .get('/reservations', { params: filterStatus ? { status: filterStatus } : {} })
      .then(({ data }) => setList(data))
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeStatus = async (reservation, next) => {
    try {
      const { data } = await api.put(`/reservations/${reservation._id}`, { status: next });
      setList((prev) => prev.map((r) => (r._id === data._id ? data : r)));
      toast.success(`Marked ${next.toLowerCase()}`);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h1>Reservations</h1>
          <p className="lead-muted mb-0">Confirm or cancel the tables customers have booked.</p>
        </div>
        <select
          className="form-select"
          style={{ maxWidth: '14rem' }}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            load(e.target.value);
          }}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loading label="Loading reservations" />
      ) : list.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No reservations to show" body="Bookings appear here as they come in." />
        </div>
      ) : (
        <div className="table-wrap mt-4">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Table</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r._id}>
                  <td>
                    <span className="fw-semibold">{r.customerName}</span>
                    <span className="meta d-block">{r.customer?.email}</span>
                    {r.notes && <span className="meta d-block">Note: {r.notes}</span>}
                  </td>
                  <td>{r.restaurant?.name}</td>
                  <td>
                    {r.table?.tableNumber}
                    <span className="meta d-block">{r.table?.section}</span>
                  </td>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td>{r.guests}</td>
                  <td>
                    <Badge bg={variant[r.status]}>{r.status}</Badge>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={r.status}
                      onChange={(e) => changeStatus(r, e.target.value)}
                      aria-label={`Update status for ${r.customerName}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ManageReservations;
