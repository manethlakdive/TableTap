import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutShop } from '../firebase/auth';
import logo from '../assets/logo.svg';

const NavIcon = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function Navbar({ shopName }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutShop();
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { to: '/menu', label: 'Menu', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { to: '/qr', label: 'QR Codes', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 17h3M17 20h3M14 20h.01' },
  ];

  return (
    <nav style={{
      background: 'var(--black)',
      borderBottom: '2px solid var(--yellow)',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logo} alt="TableTap" style={{ height: 36 }} />
          {shopName && <span style={{ fontSize: 12, color: 'var(--yellow)', fontWeight: 700, background: 'rgba(245,197,24,0.1)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(245,197,24,0.2)' }}>{shopName}</span>}
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              color: isActive ? 'var(--black)' : 'var(--white)',
              background: isActive ? 'var(--yellow)' : 'transparent',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
              transition: 'all 0.2s',
            })}>
              <NavIcon d={l.icon} />
              {l.label}
            </NavLink>
          ))}
          <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ marginLeft: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: 'var(--yellow)', cursor: 'pointer', display: 'none' }} className="hamburger">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: 'var(--dark2)', padding: '12px 0', borderTop: '1px solid var(--gray)' }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 20px',
              color: isActive ? 'var(--yellow)' : 'var(--white)',
              fontWeight: 700, textDecoration: 'none',
            })}>
              <NavIcon d={l.icon} /> {l.label}
            </NavLink>
          ))}
          <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: 'none', border: 'none', color: 'var(--red)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            Logout
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
