import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api, { errorMessage } from '../../api/client';
import Loading from '../../components/Loading.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import SafeImage from '../../components/SafeImage.jsx';

const blank = {
  name: '',
  cuisine: '',
  address: '',
  openingHours: '11:00 AM - 11:00 PM',
  description: '',
  image: '',
};

const ManageRestaurants = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () =>
    api
      .get('/restaurants')
      .then(({ data }) => setList(data))
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(blank);
    setEditing({});
  };
  const openEdit = (r) => {
    setForm({ ...blank, ...r });
    setEditing(r);
  };
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing._id) {
        await api.put(`/restaurants/${editing._id}`, form);
        toast.success('Restaurant updated');
      } else {
        await api.post('/restaurants', form);
        toast.success('Restaurant added');
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/restaurants/${toDelete._id}`);
      toast.success('Restaurant deleted');
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setToDelete(null);
    }
  };

  if (loading) return <Loading label="Loading restaurants" />;

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h1>Restaurants</h1>
          <p className="lead-muted mb-0">Add a kitchen, change its details or take it offline.</p>
        </div>
        <button className="btn btn-brand" onClick={openNew}>
          Add restaurant
        </button>
      </div>

      {list.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No restaurants yet"
            body="Add the first kitchen — food items and tables attach to it."
            action={
              <button className="btn btn-brand mt-3" onClick={openNew}>
                Add restaurant
              </button>
            }
          />
        </div>
      ) : (
        <div className="table-wrap mt-4">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Cuisine</th>
                <th>Address</th>
                <th>Hours</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <SafeImage
                        src={r.image}
                        alt={r.name}
                        style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <span className="fw-semibold">{r.name}</span>
                    </div>
                  </td>
                  <td>{r.cuisine}</td>
                  <td style={{ maxWidth: 260 }}>{r.address}</td>
                  <td>{r.openingHours}</td>
                  <td className="text-end text-nowrap">
                    <button className="btn btn-ghost btn-sm me-2" onClick={() => openEdit(r)}>
                      Edit
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setToDelete(r)}>
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
            {editing?._id ? 'Edit restaurant' : 'Add restaurant'}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={submit}>
          <Modal.Body>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="name">Name</label>
                <input id="name" name="name" className="form-control" value={form.name} onChange={change} required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="cuisine">Cuisine</label>
                <input id="cuisine" name="cuisine" className="form-control" value={form.cuisine} onChange={change} required />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="image">Image URL</label>
                <input id="image" name="image" className="form-control" value={form.image} onChange={change} required />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="address">Address</label>
                <input id="address" name="address" className="form-control" value={form.address} onChange={change} required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="openingHours">Opening hours</label>
                <input id="openingHours" name="openingHours" className="form-control" value={form.openingHours} onChange={change} />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea id="description" name="description" rows={3} className="form-control" value={form.description} onChange={change} required />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button className="btn btn-brand" disabled={saving}>
              {saving ? 'Saving…' : 'Save restaurant'}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <ConfirmDialog
        show={Boolean(toDelete)}
        title="Delete this restaurant?"
        body="Its food items and tables are removed too. This cannot be undone."
        onHide={() => setToDelete(null)}
        onConfirm={remove}
      />
    </>
  );
};

export default ManageRestaurants;
