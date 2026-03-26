import { updateOrderStatus } from '../firebase/firestore';

export default function OrderCard({ order }) {
  const formatTime = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const total = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;

  return (
    <div style={{
      background: 'var(--dark2)',
      border: `1px solid ${order.status === 'pending' ? 'rgba(245,197,24,0.4)' : 'rgba(67,160,71,0.3)'}`,
      borderRadius: 'var(--radius)',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            background: 'var(--yellow)',
            color: 'var(--black)',
            fontFamily: 'Bebas Neue, cursive',
            fontSize: 22,
            width: 44,
            height: 44,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {order.tableNo}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)' }}>Table {order.tableNo}</div>
            <div style={{ fontSize: 11, color: 'var(--gray2)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 3 }}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
              {order.persons} {order.persons === 1 ? 'person' : 'persons'} &bull; {formatTime(order.createdAt)}
            </div>
          </div>
        </div>
        <span className={`badge badge-${order.status}`}>{order.status}</span>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {order.items?.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
            <span style={{ color: 'var(--white)' }}>
              <span style={{ color: 'var(--yellow)', fontWeight: 700, marginRight: 6 }}>{item.quantity}x</span>
              {item.name}
            </span>
            <span style={{ color: 'var(--gray2)' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div style={{ borderTop: '1px solid var(--gray)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
        <span style={{ color: 'var(--gray2)', fontSize: 13 }}>Total</span>
        <span style={{ color: 'var(--yellow)' }}>Rs. {total.toLocaleString()}</span>
      </div>

      {/* Note */}
      {order.note && (
        <div style={{ background: 'var(--dark3)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--gray2)', fontStyle: 'italic' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4 }}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
          {order.note}
        </div>
      )}

      {/* Action */}
      {order.status === 'pending' && (
        <button
          onClick={() => updateOrderStatus(order.id, 'completed')}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
          Mark Completed
        </button>
      )}
    </div>
  );
}
