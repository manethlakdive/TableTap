import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerShop } from '../firebase/auth';
import logo from '../assets/logo.svg';

export default function Register() {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerShop(shopName, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.03,
        backgroundImage: 'repeating-linear-gradient(0deg, var(--yellow) 0px, var(--yellow) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, var(--yellow) 0px, var(--yellow) 1px, transparent 1px, transparent 40px)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src={logo} alt="TableTap" style={{ height: 80 }} />
          <p style={{ color: 'var(--gray2)', fontSize: 14, marginTop: 8 }}>Register Your Restaurant</p>
        </div>

        <div className="card" style={{ borderColor: 'rgba(245,197,24,0.2)' }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label>Restaurant Name</label>
              <input className="input" placeholder="My Restaurant" value={shopName} onChange={e => setShopName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="input" type="email" placeholder="shop@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="input" type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '14px 20px', fontSize: 16 }} disabled={loading}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16 }}></div> Creating account...</> : 'Register Restaurant'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--gray2)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--yellow)', fontWeight: 700 }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
