import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeQRCodes, subscribeShop } from '../firebase/firestore';
import Navbar from '../components/Navbar';
import QRGenerator from '../components/QRGenerator';
import QRCode from 'qrcode';

export default function QRPage() {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState([]);
  const [shop, setShop] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsub1 = subscribeQRCodes(user.uid, setQrCodes);
    const unsub2 = subscribeShop(user.uid, setShop);
    return () => { unsub1(); unsub2(); };
  }, [user]);

  const existingTables = qrCodes.map(q => q.tableNo);

  const downloadQR = async (qr) => {
    const url = await QRCode.toDataURL(qr.qrLink, { width: 400, margin: 2, color: { dark: '#0a0a0a', light: '#ffffff' } });
    const a = document.createElement('a');
    a.href = url;
    a.download = `table-${qr.tableNo}-qr.png`;
    a.click();
  };

  return (
    <>
      <Navbar shopName={shop?.name} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">QR Codes</h1>
            <p style={{ color: 'var(--gray2)', fontSize: 13 }}>Generate QR codes for your tables</p>
          </div>
        </div>

        {/* Generator */}
        <div className="card" style={{ marginBottom: 32, borderColor: 'rgba(245,197,24,0.2)' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 20, color: 'var(--yellow)', marginBottom: 16 }}>Generate New QR</h2>
          {user && <QRGenerator shopId={user.uid} existingTables={existingTables} />}
        </div>

        {/* Saved QRs */}
        <div>
          <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 20, marginBottom: 16 }}>Saved QR Codes ({qrCodes.length})</h2>
          {qrCodes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray2)', background: 'var(--dark2)', borderRadius: 'var(--radius)' }}>
              <p>No QR codes generated yet</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {qrCodes.sort((a, b) => a.tableNo - b.tableNo).map(qr => (
                <SavedQRCard key={qr.id} qr={qr} onDownload={downloadQR} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SavedQRCard({ qr, onDownload }) {
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    QRCode.toDataURL(qr.qrLink, { width: 200, margin: 2, color: { dark: '#0a0a0a', light: '#ffffff' } })
      .then(setImgUrl);
  }, [qr.qrLink]);

  return (
    <div style={{
      background: 'var(--dark2)',
      border: '1px solid var(--gray)',
      borderRadius: 'var(--radius)',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
    }}>
      <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 18, color: 'var(--yellow)' }}>Table {qr.tableNo}</div>
      {imgUrl && (
        <div style={{ background: 'white', padding: 8, borderRadius: 8 }}>
          <img src={imgUrl} alt={`Table ${qr.tableNo}`} style={{ width: 120, height: 120, display: 'block' }} />
        </div>
      )}
      <button onClick={() => onDownload(qr)} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
        Download
      </button>
    </div>
  );
}
