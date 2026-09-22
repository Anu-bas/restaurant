import { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api, { errorMessage } from '../../api/client';
import Loading from '../../components/Loading.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import SafeImage from '../../components/SafeImage.jsx';

const SECTIONS = ['Indoor', 'Window Side', 'Garden', 'Private Cabin', 'Rooftop'];
const blank = {
  tableNumber: '',
  restaurant: '',
  capacity: 4,
  section: 'Indoor',
  image: '',
  isAvailable: true,
};

const ManageTables = () => {
  const [tables, setTables] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () =>
    Promise.all([api.get('/tables'), api.get('/restaurants')])
      .then(([t, r]) => {
        setTables(t.data);
        setRestaurants(r.data);
      })
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm({ ...blank, restaurant: restaurants[0]?._id || '' });
    setEditing({});
  };
  const openEdit = (t) => {
    setForm({ ...blank, ...t, restaurant: t.restaurant?._id || t.restaurant });
    setEditing(t);
  };
  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      if (editing._id) {
        await api.put(`/tables/${editing._id}`, payload);
        toast.success('Table updated');
      } else {
        await api.post('/tables', payload);
        toast.success('Table added');
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (table) => {
    try {
      await api.put(`/tables/${table._id}`, { isAvailable: !table.isAvailable });
      setTables((prev) =>
        prev.map((t) => (t._id === table._id ? { ...t, isAvailable: !t.isAvailable } : t))
      );
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/tables/${toDelete._id}`);
      toast.success('Table deleted');
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setToDelete(null);
    }
  };

  if (loading) return <Loading label="Loading tables" />;

  const list = tables.filter((t) => !filter || t.restaurant?._id === filter);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h1>Tables</h1>
          <p className="lead-muted mb-0">Seating plan for every restaurant, and what can be booked.</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All restaurants</option>
            {restaurants.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
          <button className="btn btn-brand text-nowrap" onClick={openNew} disabled={restaurants.length === 0}>
            Add table
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No tables here yet" body="Add a table so customers can reserve it." />
        </div>
      ) : (
        <div className="table-wrap mt-4">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Table</th>
                <th>Restaurant</th>
                <th>Seats</th>
                <th>Section</th>
                <th>Bookable</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <SafeImage
                        src={t.image}
                        alt={`Table ${t.tableNumber}`}
                        style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <span className="fw-semibold">{t.tableNumber}</span>
                    </div>
                  </td>
                  <td>{t.restaurant?.name}</td>
                  <td>{t.capacity}</td>
                  <td>{t.section}</td>
                  <td>
                    <Form.Check
                      type="switch"
                      id={`table-avail-${t._id}`}
                      checked={t.isAvailable}
                      onChange={() => toggleAvailability(t)}
                      aria-label={`Toggle availability for table ${t.tableNumber}`}
                    />
                  </td>
                  <td className="text-end text-nowrap">
                    <button className="btn btn-ghost btn-sm me-2" onClick={() => openEdit(t)}>
                      Edit
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setToDelete(t)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={Boolean(editing)} onHide={() => setEditing(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'Fraunces, serif' }}>
            {editing?._id ? 'Edit table' : 'Add table'}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={submit}>
          <Modal.Body>
            <div className="row g-3">
              <div className="col-6 col-md-4">
                <label className="form-label" htmlFor="tableNumber">Table number</label>
                <input id="tableNumber" name="tableNumber" className="form-control" value={form.tableNumber} onChange={change} required />
              </div>
              <div className="col-6 col-md-4">
                <label className="form-label" htmlFor="capacity">Seats</label>
                <input id="capacity" type="number" min="1" max="20" name="capacity" className="form-control" value={form.capacity} onChange={change} required />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="section">Section</label>
                <select id="section" name="section" className="form-select" value={form.section} onChange={change}>
                  {SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="restaurant">Restaurant</label>
                <select id="restaurant" name="restaurant" className="form-select" value={form.restaurant} onChange={change} required>
                  {restaurants.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6 d-flex align-items-end">
                <Form.Check
                  type="switch"
                  id="isAvailable"
                  name="isAvailable"
                  label="Open for booking"
                  checked={form.isAvailable}
                  onChange={change}
                />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="image">Image URL</label>
                <input id="image" name="image" className="form-control" value={form.image} onChange={change} required />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button className="btn btn-brand" disabled={saving}>
              {saving ? 'Saving…' : 'Save table'}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <ConfirmDialog
        show={Boolean(toDelete)}
        title="Delete this table?"
        body="Reservations for this table are removed as well."
        onHide={() => setToDelete(null)}
        onConfirm={remove}
      />
    </>
  );
};

export default ManageTables;
