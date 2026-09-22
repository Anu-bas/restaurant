import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../api/client';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(form.email, form.password, 'admin');
      toast.success('Signed in to the admin console');
      navigate('/admin', { replace: true });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="auth-wrap">
          <h1 style={{ fontSize: '1.8rem' }}>Admin login</h1>
          <p className="meta">Restaurant staff only. Customer accounts cannot sign in here.</p>
          <form onSubmit={submit} className="mt-3">
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Work email</label>
              <input id="email" type="email" name="email" className="form-control" value={form.email} onChange={change} required />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" type="password" name="password" className="form-control" value={form.password} onChange={change} required />
            </div>
            <button className="btn btn-brand w-100" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="meta mt-3 mb-0">
            Looking for the customer login? <Link to="/login">Go here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
