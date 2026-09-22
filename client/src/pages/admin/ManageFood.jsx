import { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api, { errorMessage } from '../../api/client';
import Loading from '../../components/Loading.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import SafeImage from '../../components/SafeImage.jsx';

const CATEGORIES = ['Starter', 'Main Course', 'Biryani', 'Breads', 'Dessert', 'Beverage'];
const blank = {
  name: '',
  image: '',
  description: '',
  category: 'Main Course',
  price: '',
  restaurant: '',
  isAvailable: true,
};

const ManageFood = () => {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () =>
    Promise.all([api.get('/menu'), api.get('/restaurants')])
      .then(([m, r]) => {
        setFoods(m.data);
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
  const openEdit = (f) => {
    setForm({ ...blank, ...f, restaurant: f.restaurant?._id || f.restaurant });
    setEditing(f);
  };
  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editing._id) {
        await api.put(`/menu/${editing._id}`, payload);
        toast.success('Food item updated');
      } else {
        await api.post('/menu', payload);
        toast.success('Food item added');
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (food) => {
    try {
      await api.put(`/menu/${food._id}`, { isAvailable: !food.isAvailable });
      setFoods((prev) =>
        prev.map((f) => (f._id === food._id ? { ...f, isAvailable: !f.isAvailable } : f))
      );
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/menu/${toDelete._id}`);
      toast.success('Food item deleted');
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setToDelete(null);
    }
  };

  if (loading) return <Loading label="Loading the menu" />;

  const list = foods.filter((f) => !filter || f.restaurant?._id === filter);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h1>Food</h1>
          <p className="lead-muted mb-0">Add dishes, change prices and mark items sold out.</p>
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
            Add food
          </button>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="Add a restaurant first" body="Every dish belongs to a restaurant." />
        </div>
      ) : list.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No dishes here yet" body="Add the first item to this menu." />
        </div>
      ) : (
        <div className="table-wrap mt-4">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Dish</th>
                <th>Restaurant</th>
                <th>Category</th>
                <th>Price</th>
                <th>Available</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.map((f) => (
                <tr key={f._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <SafeImage
                        src={f.image}
                        alt={f.name}
                        style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <span className="fw-semibold">{f.name}</span>
                    </div>
                  </td>
                  <td>{f.restaurant?.name}</td>
                  <td>{f.category}</td>
                  <td>₹{f.price}</td>
                  <td>
                    <Form.Check
                      type="switch"
                      id={`avail-${f._id}`}
                      checked={f.isAvailable}
                      onChange={() => toggleAvailability(f)}
                      aria-label={`Toggle availability for ${f.name}`}
                    />
                  </td>
                  <td className="text-end text-nowrap">
                    <button className="btn btn-ghost btn-sm me-2" onClick={() => openEdit(f)}>
                      Edit
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setToDelete(f)}>
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
            {editing?._id ? 'Edit food item' : 'Add food item'}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={submit}>
          <Modal.Body>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="name">Dish name</label>
                <input id="name" name="name" className="form-control" value={form.name} onChange={change} required />
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
              <div className="col-12">
                <label className="form-label" htmlFor="image">Image URL</label>
                <input id="image" name="image" className="form-control" value={form.image} onChange={change} required />
              </div>
              <div className="col-6 col-md-4">
                <label className="form-label" htmlFor="category">Category</label>
                <select id="category" name="category" className="form-select" value={form.category} onChange={change}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-4">
                <label className="form-label" htmlFor="price">Price (₹)</label>
                <input id="price" type="number" min="0" step="1" name="price" className="form-control" value={form.price} onChange={change} required />
              </div>
              <div className="col-12 col-md-4 d-flex align-items-end">
                <Form.Check
                  type="switch"
                  id="isAvailable"
                  name="isAvailable"
                  label="Available today"
                  checked={form.isAvailable}
                  onChange={change}
                />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea id="description" name="description" rows={2} className="form-control" value={form.description} onChange={change} />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button className="btn btn-brand" disabled={saving}>
              {saving ? 'Saving…' : 'Save dish'}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <ConfirmDialog
        show={Boolean(toDelete)}
        title="Delete this dish?"
        body="It disappears from the menu and from every open cart."
        onHide={() => setToDelete(null)}
        onConfirm={remove}
      />
    </>
  );
};

export default ManageFood;
