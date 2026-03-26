import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeMenu, addMenuItem, updateMenuItem, subscribeShop } from '../firebase/firestore';
import Navbar from '../components/Navbar';
import MenuCard from '../components/MenuCard';

const CATEGORIES = ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Rice & Noodles', 'Grills', 'Seafood', 'Vegetarian', 'Other'];

const emptyForm = { name: '', price: '', description: '', imageUrl: '', category: 'Other', available: true };

export default function MenuManager() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  useEffect(() => {
    if (!user) return;
    const unsub1 = subscribeMenu(user.uid, setItems);
    const unsub2 = subscribeShop(user.uid, setShop);
    return () => { unsub1(); unsub2(); };
  }, [user]);

  const handleEdit = (item) => {
    setForm({ name: item.name, price: item.price, description: item.description || '', imageUrl: item.imageUrl || '', category: item.category || 'Other', available: item.available });
    setEditId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { ...form, price: parseFloat(form.price) };
    try {
      if (editId) {
        await updateMenuItem(editId, data);
      } else {
        await addMenuItem(user.uid, data);
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const cats = ['All', ...new Set(items.map(i => i.category).filter(Boolean))];
  const filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || i.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <>
      <Navbar shopName={shop?.name} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Menu Manager</h1>
            <p style={{ color: 'var(--gray2)', fontSize: 13 }}>{items.length} items</p>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }} className="btn btn-primary">
            {showForm ? (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>Cancel</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Add Item</>
            )}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: 24, borderColor: 'rgba(245,197,24,0.3)' }}>
            <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 22, marginBottom: 16, color: 'var(--yellow)' }}>
              {editId ? 'Edit Item' : 'New Menu Item'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 16 }}>
                <div className="form-group">
                  <label>Item Name</label>
                  <input className="input" placeholder="e.g. Chicken Burger" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Price (Rs.)</label>
                  <input className="input" type="number" placeholder="0.00" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required min="0" step="0.01" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input className="input" placeholder="https://..." value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea className="input" placeholder="Brief description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--yellow)' }} />
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Available</span>
                </label>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <><div className="spinner" style={{ width: 16, height: 16 }}></div> Saving...</> : (editId ? 'Update Item' : 'Add to Menu')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <input className="input" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 220 }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} style={{
                padding: '6px 14px', border: 'none', borderRadius: 20,
                background: catFilter === c ? 'var(--yellow)' : 'var(--dark3)',
                color: catFilter === c ? 'var(--black)' : 'var(--gray2)',
                fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito',
              }}>{c}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray2)' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.3, marginBottom: 16 }}><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            <p style={{ fontWeight: 700 }}>No items found</p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map(item => <MenuCard key={item.id} item={item} onEdit={handleEdit} />)}
          </div>
        )}
      </div>
    </>
  );
}
