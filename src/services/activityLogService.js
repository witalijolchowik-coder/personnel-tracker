import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase.js';

const sanitizeForLog = (value) => {
  if (value === undefined) return null;
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(sanitizeForLog);
  if (typeof value.toDate === 'function') return value.toDate().toISOString();

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .map(([key, entryValue]) => [key, sanitizeForLog(entryValue)])
  );
};

export const addActivityLog = async ({
  actionType,
  entityType,
  entityId,
  previousValue = null,
  newValue = null,
  user,
}) => {
  if (!user) return;

  await addDoc(collection(db, 'activityLog'), {
    actionType,
    entityType,
    entityId,
    previousValue: sanitizeForLog(previousValue),
    newValue: sanitizeForLog(newValue),
    userId: user.uid,
    userEmail: user.email || '',
    createdAt: serverTimestamp(),
  });
};
