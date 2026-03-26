import { db } from './config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  getDocs,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

// MENU
export const addMenuItem = (shopId, item) =>
  addDoc(collection(db, 'menus'), { ...item, shopId });

export const updateMenuItem = (id, data) =>
  updateDoc(doc(db, 'menus', id), data);

export const deleteMenuItem = (id) =>
  deleteDoc(doc(db, 'menus', id));

export const subscribeMenu = (shopId, callback) => {
  const q = query(collection(db, 'menus'), where('shopId', '==', shopId));
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
};

// ORDERS
export const placeOrder = (order) =>
  addDoc(collection(db, 'orders'), {
    ...order,
    status: 'pending',
    createdAt: serverTimestamp(),
  });

export const updateOrderStatus = (id, status) =>
  updateDoc(doc(db, 'orders', id), { status });

export const subscribeOrders = (shopId, callback) => {
  const q = query(collection(db, 'orders'), where('shopId', '==', shopId));
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
};

// QR CODES
export const saveQRCode = async (shopId, tableNo, qrLink) => {
  const id = `${shopId}_table_${tableNo}`;
  await setDoc(doc(db, 'qrcodes', id), { shopId, tableNo, qrLink }, { merge: true });
};

export const getQRCodes = async (shopId) => {
  const q = query(collection(db, 'qrcodes'), where('shopId', '==', shopId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const subscribeQRCodes = (shopId, callback) => {
  const q = query(collection(db, 'qrcodes'), where('shopId', '==', shopId));
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
};

// SHOP
export const subscribeShop = (shopId, callback) => {
  return onSnapshot(doc(db, 'shops', shopId), (d) => {
    if (d.exists()) callback({ id: d.id, ...d.data() });
  });
};
