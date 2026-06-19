import { collection, deleteDoc, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.js';
import { generateId } from '../utils/idUtils.js';
import { addActivityLog } from './activityLogService.js';

const candidatesCollection = collection(db, 'candidates');

const cleanDocument = (value) => Object.fromEntries(
  Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)
);

const getCandidate = async (candidateId) => {
  const candidateRef = doc(db, 'candidates', candidateId);
  const candidateSnapshot = await getDoc(candidateRef);
  return candidateSnapshot.exists() ? { id: candidateSnapshot.id, ...candidateSnapshot.data() } : null;
};

const sortByCreatedAtDesc = (items) => [...items].sort((a, b) => {
  const aTime = typeof a.createdAt?.toMillis === 'function' ? a.createdAt.toMillis() : 0;
  const bTime = typeof b.createdAt?.toMillis === 'function' ? b.createdAt.toMillis() : 0;
  return bTime - aTime;
});

export const subscribeToCandidates = (onNext, onError) => onSnapshot(
  candidatesCollection,
  (snapshot) => {
    const candidates = snapshot.docs.map(candidateDoc => ({ id: candidateDoc.id, ...candidateDoc.data() }));
    onNext(sortByCreatedAtDesc(candidates));
  },
  onError
);

export const createCandidateDocument = async (candidateData, user) => {
  const candidateId = candidateData.id || generateId('candidate');
  const candidateRef = doc(db, 'candidates', candidateId);
  const candidate = cleanDocument({
    ...candidateData,
    id: candidateId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: user.uid,
    updatedBy: user.uid,
  });

  await setDoc(candidateRef, candidate);
  await addActivityLog({ actionType: 'candidate_create', entityType: 'candidate', entityId: candidateId, previousValue: null, newValue: candidateData, user });
  return candidateId;
};

export const updateCandidateDocument = async (candidateId, patch, user, actionType = 'candidate_update') => {
  const previousCandidate = await getCandidate(candidateId);
  const candidateRef = doc(db, 'candidates', candidateId);
  const nextPatch = cleanDocument({
    ...patch,
    updatedAt: serverTimestamp(),
    updatedBy: user.uid,
  });

  await updateDoc(candidateRef, nextPatch);
  await addActivityLog({ actionType, entityType: 'candidate', entityId: candidateId, previousValue: previousCandidate, newValue: patch, user });
};

export const deleteCandidateDocument = async (candidateId, user) => {
  const previousCandidate = await getCandidate(candidateId);
  await deleteDoc(doc(db, 'candidates', candidateId));
  await addActivityLog({ actionType: 'candidate_delete', entityType: 'candidate', entityId: candidateId, previousValue: previousCandidate, newValue: null, user });
};
