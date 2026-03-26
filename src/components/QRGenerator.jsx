import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { saveQRCode } from '../firebase/firestore';

export default function QRGenerator({ shopId, existingTables = [] }) {
  const [tableNo, setTableNo] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [qrLink, setQrLink] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const generate = async () => {
    setError('');
    setSaved(false);
    const t = parseInt(tableNo);
    if (!t || t < 1) { setError('Enter a valid table number'); return; }
    if (existingTables.includes(t)) { setError(`QR for Table ${t} already exists`); return; }
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/order?shopId=${shopId}&table=${t}`;
    setQrLink(link);
    const url = await QRCode.toDataURL(link, {
      width: 240,
      margin: 2,
      color: { dark: '#0a0a0a', light: '#ffffff' },
    });
    setQrUrl(url);
  };

  const save = async () => {
    await saveQRCode(shopId, parseInt(tableNo), qrLink);
    setSaved(true);
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `table-${tableNo}-qr.png`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          className="input"
          type="number"
          placeholder="Table number"
          value={tableNo}
          onChange={(e) => setTableNo(e.target.value)}
          min="1"
        />
        <button onClick={generate} className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h.01M14 18h.01M18 14h.01M18 18h.01" /></svg>
          Generate
        </button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {qrUrl && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 20, background: 'var(--dark3)', borderRadius: 'var(--radius)', border: '1px solid var(--gray)' }}>
          <div style={{ background: 'white', padding: 12, borderRadius: 8 }}>
            <img src={qrUrl} alt="QR Code" style={{ display: 'block', width: 200, height: 200 }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--yellow)', fontWeight: 700 }}>Table {tableNo}</div>
          <div style={{ fontSize: 10, color: 'var(--gray2)', wordBreak: 'break-all', textAlign: 'center', maxWidth: 280 }}>{qrLink}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={download} className="btn btn-ghost btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              Download
            </button>
            {!saved ? (
              <button onClick={save} className="btn btn-primary btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                Save QR
              </button>
            ) : (
              <span className="badge badge-completed" style={{ padding: '6px 14px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4 }}><polyline points="20 6 9 17 4 12" /></svg>
                Saved
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
