import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDfaiVprO0_c3-CPVQW2A0CTWCq5U-j-Bc",
  authDomain: "restaurant-order-system-90060.firebaseapp.com",
  projectId: "restaurant-order-system-90060",
  storageBucket: "restaurant-order-system-90060.firebasestorage.app",
  messagingSenderId: "328339864038",
  appId: "1:328339864038:web:3cd611ccd7c1cf6cbffe27"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
