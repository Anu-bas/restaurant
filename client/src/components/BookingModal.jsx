import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { errorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';

const today = () => new Date().toISOString().slice(0, 10);

const BookingModal = ({ table, show, onHide, onBooked }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: user?.name || '',
    date: today(),
    time: '19:30',
    guests: 2,
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  if (!table) return null;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/reservations', {
        table: table._id,
        customerName: form.customerName,
        date: form.date,
        time: form.time,
        guests: Number(form.guests),
        notes: form.notes,
      });
      toast.success('Table reserved successfully!');
      onHide();
      if (onBooked) onBooked();
      else navigate('/my-reservations');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontFamily: 'Fraunces, serif' }}>
          Reserve table {table.tableNumber}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={submit}>
        <Modal.Body>
          <p className="meta mb-3">
            {table.restaurant?.name} · seats {table.capacity} · {table.section}
          </p>

          <div className="mb-3">
            <label className="form-label" htmlFor="customerName">Name on the booking</label>
            <input
              id="customerName"
              name="customerName"
              className="form-control"
              value={form.customerName}
              onChange={change}
              required
            />
          </div>

          <div className="row g-3">
            <div className="col-6">
              <label className="form-label" htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                name="date"
                min={today()}
                className="form-control"
                value={form.date}
                onChange={change}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label" htmlFor="time">Time</label>
              <input
                id="time"
                type="time"
                name="time"
                className="form-control"
                value={form.time}
                onChange={change}
                required
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="form-label" htmlFor="guests">Guests</label>
            <select
              id="guests"
              name="guests"
              className="form-select"
              value={form.guests}
              onChange={change}
            >
              {Array.from({ length: table.capacity }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <div className="form-text">This table seats up to {table.capacity} guests.</div>
          </div>

          <div className="mt-3">
            <label className="form-label" htmlFor="notes">Anything we should know? (optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              className="form-control"
              value={form.notes}
              onChange={change}
              placeholder="Birthday, high chair, window seat…"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-ghost" onClick={onHide}>
            Cancel
          </button>
          <button type="submit" className="btn btn-brand" disabled={saving}>
            {saving ? 'Reserving…' : 'Confirm reservation'}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default BookingModal;
