import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { subscribeMenu, subscribeShop, placeOrder } from '../firebase/firestore';
import logo from '../assets/logo.svg';

export default function CustomerMenu() {
  const [params] = useSearchParams();
  const shopId = params.get('shopId');
  const tableNo = parseInt(params.get('table'));

  const [menu, setMenu] = useState([]);
  const [shop, setShop] = useState(null);
  const [cart, setCart] = useState({});
  const [step, setStep] = useState('menu'); // menu | checkout | done
  const [persons, setPersons] = useState(1);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [catFilter, setCatFilter] = useState('All');

  useEffect(() => {
    if (!shopId) return;
    const unsub1 = subscribeMenu(shopId, (items) => setMenu(items.filter(i => i.available)));
    const unsub2 = subscribeShop(shopId, setShop);
    return () => { unsub1(); unsub2(); };
  }, [shopId]);

  if (!shopId || !tableNo) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 20 }}>
        <img src={logo} alt="TableTap" style={{ height: 60 }} />
        <p style={{ color: 'var(--red)', fontWeight: 700 }}>Invalid QR Code. Please scan again.</p>
      </div>
    );
  }

  const addToCart = (item) => setCart(c => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));
  const removeFromCart = (item) => setCart(c => {
    const n = { ...c };
    if (n[item.id] > 1) n[item.id]--;
    else delete n[item.id];
    return n;
  });

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const item = menu.find(m => m.id === id);
    return item ? { ...item, quantity: qty } : null;
  }).filter(Boolean);

  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);

  const placeOrderHandler = async () => {
    setLoading(true);
    await placeOrder({
      shopId,
      tableNo,
      items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      persons,
      note,
    });
    setStep('done');
    setLoading(false);
  };

  const cats = ['All', ...new Set(menu.map(i => i.category).filter(Boolean))];
  const filtered = catFilter === 'All' ? menu : menu.filter(i => i.category === catFilter);

  if (step === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, padding: 20 }}>
        <img src={logo} alt="TableTap" style={{ height: 60 }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, background: 'rgba(67,160,71,0.15)', border: '2px solid var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 32, color: 'var(--white)' }}>Order Placed!</h2>
          <p style={{ color: 'var(--gray2)', marginTop: 8 }}>Your order for Table {tableNo} has been sent to the staff.</p>
          <p style={{ color: 'var(--yellow)', fontWeight: 700, marginTop: 4 }}>Please wait while we prepare your food.</p>
          <button onClick={() => { setCart({}); setStep('menu'); setNote(''); setPersons(1); }} className="btn btn-primary" style={{ marginTop: 24 }}>
            Order More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', paddingBottom: cartCount > 0 ? 100 : 20 }}>
      {/* Header */}
      <div style={{ background: 'var(--dark)', borderBottom: '2px solid var(--yellow)', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={logo} alt="TableTap" style={{ height: 32 }} />
            {shop && <span style={{ fontWeight: 800, fontSize: 15 }}>{shop.name}</span>}
          </div>
          <div style={{ background: 'var(--yellow)', color: 'var(--black)', fontWeight: 800, fontSize: 13, padding: '4px 12px', borderRadius: 20 }}>
            Table {tableNo}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
        {step === 'menu' && (
          <>
            {/* Category filter */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
              {cats.map(c => (
                <button key={c} onClick={() => setCatFilter(c)} style={{
                  padding: '7px 16px', border: 'none', borderRadius: 20,
                  background: catFilter === c ? 'var(--yellow)' : 'var(--dark3)',
                  color: catFilter === c ? 'var(--black)' : 'var(--gray2)',
                  fontWeight: 700, fontSize: 12, cursor: 'pointer',
                  fontFamily: 'Nunito', whiteSpace: 'nowrap', flexShrink: 0,
                }}>{c}</button>
              ))}
            </div>

            {/* Menu items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(item => (
                <div key={item.id} style={{
                  background: 'var(--dark2)',
                  border: '1px solid var(--gray)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  gap: 12,
                  overflow: 'hidden',
                }}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} style={{ width: 90, objectFit: 'cover', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />
                  )}
                  <div style={{ flex: 1, padding: '12px 12px 12px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div>
                        <h3 style={{ fontWeight: 800, fontSize: 15 }}>{item.name}</h3>
                        {item.description && <p style={{ fontSize: 12, color: 'var(--gray2)', marginTop: 2, lineHeight: 1.3 }}>{item.description}</p>}
                        <p style={{ color: 'var(--yellow)', fontWeight: 800, marginTop: 6, fontSize: 15 }}>Rs. {item.price?.toLocaleString()}</p>
                      </div>
                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        {cart[item.id] ? (
                          <>
                            <button onClick={() => removeFromCart(item)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--yellow)', background: 'transparent', color: 'var(--yellow)', fontWeight: 800, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                            <span style={{ fontWeight: 800, minWidth: 20, textAlign: 'center' }}>{cart[item.id]}</span>
                            <button onClick={() => addToCart(item)} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'var(--yellow)', color: 'var(--black)', fontWeight: 800, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                          </>
                        ) : (
                          <button onClick={() => addToCart(item)} style={{ padding: '6px 16px', border: 'none', borderRadius: 20, background: 'var(--yellow)', color: 'var(--black)', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito' }}>Add</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 'checkout' && (
          <div>
            <button onClick={() => setStep('menu')} style={{ background: 'none', border: 'none', color: 'var(--yellow)', cursor: 'pointer', fontWeight: 700, fontSize: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Nunito' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              Back to Menu
            </button>
            <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 26, marginBottom: 20 }}>Your Order</h2>

            {/* Cart items */}
            <div className="card" style={{ marginBottom: 16 }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray)' }}>
                  <span style={{ fontWeight: 700 }}><span style={{ color: 'var(--yellow)' }}>{item.quantity}x</span> {item.name}</span>
                  <span style={{ color: 'var(--yellow)', fontWeight: 700 }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontWeight: 800, fontSize: 17 }}>
                <span>Total</span>
                <span style={{ color: 'var(--yellow)' }}>Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label>Number of Persons</label>
                <input className="input" type="number" min="1" max="20" value={persons} onChange={e => setPersons(parseInt(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Special Note (Optional)</label>
                <textarea className="input" placeholder="Any special requests..." value={note} onChange={e => setNote(e.target.value)} style={{ minHeight: 70 }} />
              </div>
              <button onClick={placeOrderHandler} className="btn btn-primary" style={{ justifyContent: 'center', padding: '14px', fontSize: 16 }} disabled={loading}>
                {loading ? <><div className="spinner" style={{ width: 18, height: 18 }}></div> Placing Order...</> : `Place Order - Rs. ${cartTotal.toLocaleString()}`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating cart bar */}
      {cartCount > 0 && step === 'menu' && (
        <div style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          width: 'calc(100% - 40px)', maxWidth: 560,
          background: 'var(--yellow)', borderRadius: 14, padding: '14px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          cursor: 'pointer',
          zIndex: 99,
        }} onClick={() => setStep('checkout')}>
          <span style={{ background: 'rgba(0,0,0,0.15)', color: 'var(--black)', borderRadius: 20, padding: '2px 10px', fontWeight: 800 }}>{cartCount}</span>
          <span style={{ color: 'var(--black)', fontWeight: 800, fontSize: 15 }}>View Cart</span>
          <span style={{ color: 'var(--black)', fontWeight: 800 }}>Rs. {cartTotal.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
