import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase.js';
import { buildActivityDescription, getUserFirstName } from '../utils/activityLogUtils.js';

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

  const description = buildActivityDescription({ actionType, entityType, previousValue, newValue });

  await addDoc(collection(db, 'activityLog'), {
    type: actionType,
    actionType,
    entityType,
    entityId,
    previousValue: sanitizeForLog(previousValue),
    newValue: sanitizeForLog(newValue),
    userName: getUserFirstName(user.email || ''),
    userId: user.uid,
    userEmail: user.email || '',
    description,
    createdAt: serverTimestamp(),
  });
};

export const subscribeToActivityLog = (onNext, onError) => {
  const activityLogQuery = query(
    collection(db, 'activityLog'),
    orderBy('createdAt', 'desc'),
    limit(100)
  );

  return onSnapshot(
    activityLogQuery,
    (snapshot) => {
      const entries = snapshot.docs.map(activityDoc => ({ id: activityDoc.id, ...activityDoc.data() }));
      onNext(entries);
    },
    onError
  );
};
