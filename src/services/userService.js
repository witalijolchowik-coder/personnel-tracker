import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.js';

export const ensureUserDocument = async (user) => {
  if (!user) return null;

  const userRef = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userRef);
  const userData = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email || '',
    role: 'recruiter',
    updatedAt: serverTimestamp(),
  };

  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
    });
    return { ...userData, createdAt: null, updatedAt: null };
  }

  await updateDoc(userRef, {
    email: user.email || '',
    displayName: user.displayName || user.email || '',
    updatedAt: serverTimestamp(),
  });

  return { id: userSnapshot.id, ...userSnapshot.data() };
};
