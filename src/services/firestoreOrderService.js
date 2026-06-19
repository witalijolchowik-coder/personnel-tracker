import { collection, deleteDoc, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.js';
import { generateId } from '../utils/idUtils.js';
import { normalizeOrderGender } from '../utils/orderUtils.js';
import { addActivityLog } from './activityLogService.js';

const ordersCollection = collection(db, 'orders');

const cleanDocument = (value) => Object.fromEntries(
  Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)
);

const getOrder = async (orderId) => {
  const orderRef = doc(db, 'orders', orderId);
  const orderSnapshot = await getDoc(orderRef);
  return orderSnapshot.exists() ? { id: orderSnapshot.id, ...orderSnapshot.data() } : null;
};

const sortOrders = (items) => [...items].sort((a, b) => {
  if (a.assessmentDate !== b.assessmentDate) return String(a.assessmentDate || '').localeCompare(String(b.assessmentDate || ''));
  const aTime = typeof a.createdAt?.toMillis === 'function' ? a.createdAt.toMillis() : 0;
  const bTime = typeof b.createdAt?.toMillis === 'function' ? b.createdAt.toMillis() : 0;
  return bTime - aTime;
});

export const subscribeToOrders = (onNext, onError) => onSnapshot(
  ordersCollection,
  (snapshot) => {
    const orders = snapshot.docs.map(orderDoc => ({ id: orderDoc.id, ...orderDoc.data() }));
    onNext(sortOrders(orders));
  },
  onError
);

export const createOrderDocument = async (orderData, user, actionType = 'order_create') => {
  const orderId = orderData.id || generateId('order');
  const orderRef = doc(db, 'orders', orderId);
  const order = cleanDocument({
    ...orderData,
    id: orderId,
    gender: normalizeOrderGender(orderData.gender),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: user.uid,
    updatedBy: user.uid,
  });

  await setDoc(orderRef, order);
  await addActivityLog({ actionType, entityType: 'order', entityId: orderId, previousValue: null, newValue: orderData, user });
  return orderId;
};

export const updateOrderDocument = async (orderId, patch, user) => {
  const previousOrder = await getOrder(orderId);
  const orderRef = doc(db, 'orders', orderId);
  const nextPatch = cleanDocument({
    ...patch,
    gender: patch.gender ? normalizeOrderGender(patch.gender) : undefined,
    updatedAt: serverTimestamp(),
    updatedBy: user.uid,
  });

  await updateDoc(orderRef, nextPatch);
  await addActivityLog({ actionType: 'order_update', entityType: 'order', entityId: orderId, previousValue: previousOrder, newValue: patch, user });
};

export const deleteOrderDocument = async (orderId, user) => {
  const previousOrder = await getOrder(orderId);
  await deleteDoc(doc(db, 'orders', orderId));
  await addActivityLog({ actionType: 'order_delete', entityType: 'order', entityId: orderId, previousValue: previousOrder, newValue: null, user });
};

export const repeatOrderDocument = async (orderId, newDate, user) => {
  const sourceOrder = await getOrder(orderId);
  if (!sourceOrder) return null;

  const repeatedOrderId = generateId('order');
  const orderRef = doc(db, 'orders', repeatedOrderId);
  const repeatedOrder = {
    id: repeatedOrderId,
    department: sourceOrder.department,
    count: sourceOrder.count,
    gender: normalizeOrderGender(sourceOrder.gender),
    assessmentDate: newDate,
    assessmentTime: sourceOrder.assessmentTime || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: user.uid,
    updatedBy: user.uid,
  };

  await setDoc(orderRef, repeatedOrder);
  await addActivityLog({ actionType: 'order_repeat', entityType: 'order', entityId: repeatedOrderId, previousValue: sourceOrder, newValue: repeatedOrder, user });
  return repeatedOrderId;
};
