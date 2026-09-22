import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../api/client';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Both passwords must match.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    setBusy(true);
    try {
      const user = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      toast.success(`Account created. Welcome, ${user.name.split(' ')[0]}`);
      navigate('/dashboard', { replace: true });
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
          <h1 style={{ fontSize: '1.8rem' }}>Create your account</h1>
          <p className="meta">One account for ordering and reservations.</p>
          <form onSubmit={submit} className="mt-3">
            <div className="mb-3">
              <label className="form-label" htmlFor="name">Full name</label>
              <input id="name" name="name" className="form-control" value={form.name} onChange={change} required />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" type="email" name="email" className="form-control" value={form.email} onChange={change} required />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" className="form-control" value={form.phone} onChange={change} />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" type="password" name="password" className="form-control" value={form.password} onChange={change} required />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="confirm">Confirm password</label>
              <input id="confirm" type="password" name="confirm" className="form-control" value={form.confirm} onChange={change} required />
            </div>
            <button className="btn btn-brand w-100" disabled={busy}>
              {busy ? 'Creating…' : 'Create account'}
            </button>
          </form>
          <p className="meta mt-3 mb-0">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
