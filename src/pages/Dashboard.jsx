import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeOrders, subscribeShop } from '../firebase/firestore';
import Navbar from '../components/Navbar';
import OrderCard from '../components/OrderCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [shop, setShop] = useState(null);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    if (!user) return;
    const unsub1 = subscribeOrders(user.uid, setOrders);
    const unsub2 = subscribeShop(user.uid, setShop);
    return () => { unsub1(); unsub2(); };
  }, [user]);

  const filtered = orders
    .filter(o => filter === 'all' ? true : o.status === filter)
    .sort((a, b) => {
      const ta = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const tb = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return tb - ta;
    });

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <>
      <Navbar shopName={shop?.name} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Live Orders</h1>
            <p style={{ color: 'var(--gray2)', fontSize: 13 }}>Real-time order management</p>
          </div>
          {pendingCount > 0 && (
            <div style={{ background: 'var(--yellow)', color: 'var(--black)', borderRadius: 12, padding: '8px 20px', fontWeight: 800, fontSize: 24, fontFamily: 'Bebas Neue, cursive' }}>
              {pendingCount} PENDING
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: 'var(--dark3)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
          {['pending', 'completed', 'all'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: 8,
              background: filter === f ? 'var(--yellow)' : 'transparent',
              color: filter === f ? 'var(--black)' : 'var(--gray2)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontFamily: 'Nunito',
              transition: 'all 0.2s',
            }}>
              {f} {f === 'pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--gray2)' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.3, marginBottom: 16 }}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <p style={{ fontSize: 16, fontWeight: 700 }}>No {filter === 'all' ? '' : filter} orders</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Orders will appear here in real-time</p>
          </div>
        ) : (
          <div className="grid-2">
            {filtered.map(o => <OrderCard key={o.id} order={o} />)}
          </div>
        )}
      </div>
    </>
  );
}
