import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../api/client';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', password: '' });
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      setForm({ ...form, password: '' });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="auth-wrap">
          <h1 style={{ fontSize: '1.8rem' }}>Your profile</h1>
          <p className="meta">Signed in as {user.email}</p>
          <form onSubmit={submit} className="mt-3">
            <div className="mb-3">
              <label className="form-label" htmlFor="name">Name</label>
              <input id="name" name="name" className="form-control" value={form.name} onChange={change} required />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" className="form-control" value={form.phone} onChange={change} />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">New password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={change}
                placeholder="Leave blank to keep the current one"
              />
            </div>
            <button className="btn btn-brand w-100" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
