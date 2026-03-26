import { deleteMenuItem, updateMenuItem } from '../firebase/firestore';

export default function MenuCard({ item, onEdit }) {
  const toggleAvail = () => updateMenuItem(item.id, { available: !item.available });
  const handleDelete = () => {
    if (window.confirm('Delete this item?')) deleteMenuItem(item.id);
  };

  return (
    <div style={{
      background: 'var(--dark2)',
      border: '1px solid var(--gray)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 160, background: 'var(--dark3)' }}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray2)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          </div>
        )}
        <span className={`badge badge-${item.available ? 'available' : 'unavailable'}`} style={{ position: 'absolute', top: 8, right: 8 }}>
          {item.available ? 'Available' : 'Unavailable'}
        </span>
        {item.category && (
          <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.7)', color: 'var(--yellow)', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase' }}>
            {item.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--white)' }}>{item.name}</h3>
          <span style={{ color: 'var(--yellow)', fontWeight: 800, fontSize: 15, whiteSpace: 'nowrap', marginLeft: 8 }}>Rs. {item.price?.toLocaleString()}</span>
        </div>
        {item.description && (
          <p style={{ fontSize: 12, color: 'var(--gray2)', lineHeight: 1.4 }}>{item.description}</p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, padding: '0 14px 14px' }}>
        <button onClick={toggleAvail} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
          {item.available ? (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" /></svg>Disable</>
          ) : (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>Enable</>
          )}
        </button>
        <button onClick={() => onEdit(item)} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>Edit
        </button>
        <button onClick={handleDelete} className="btn btn-danger btn-sm" style={{ justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" /></svg>
        </button>
      </div>
    </div>
  );
}
