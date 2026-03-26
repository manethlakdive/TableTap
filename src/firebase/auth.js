import { auth } from './config';
import { db } from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const registerShop = async (shopName, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, 'shops', user.uid), {
    name: shopName,
    email: email,
    createdAt: new Date(),
  });
  return user;
};

export const loginShop = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutShop = () => signOut(auth);
