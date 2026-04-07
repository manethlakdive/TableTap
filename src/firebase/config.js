import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyALVsEEEKdKQLCe5LqRdZPn6uogPj1Y8OU",
  authDomain: "tabletap-b8582.firebaseapp.com",
  projectId: "tabletap-b8582",
  storageBucket: "tabletap-b8582.firebasestorage.app",
  messagingSenderId: "1063272095896",
  appId: "1:1063272095896:web:602eb9419eca02b05370ed"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
