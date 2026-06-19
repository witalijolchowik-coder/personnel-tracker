import { useEffect, useState } from 'react';
import { SEED_ORDERS } from '../data/seedData.js';
import { createOrderDocument, deleteOrderDocument, repeatOrderDocument, subscribeToOrders, updateOrderDocument } from '../services/firestoreOrderService.js';
import { generateId } from '../utils/idUtils.js';
import { normalizeOrderGender } from '../utils/orderUtils.js';

const normalizeOrder = (order) => ({
  createdBy: null,
  updatedBy: null,
  ...order,
  id: order.id || generateId('order'),
  gender: normalizeOrderGender(order.gender),
});

const buildNewOrder = (orderData) => normalizeOrder({
  ...orderData,
  id: generateId('order'),
});

export const useOrders = (currentUser) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError('');
    return subscribeToOrders(
      (nextOrders) => {
        setOrders(nextOrders.map(normalizeOrder));
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message || 'Nie udaĹ‚o siÄ™ pobraÄ‡ zamĂłwieĹ„ z Firebase.');
        setLoading(false);
      }
    );
  }, [currentUser]);

  const createOrder = async (orderData) => {
    try {
      const newOrder = buildNewOrder(orderData);
      await createOrderDocument(newOrder, currentUser);
      return newOrder;
    } catch (operationError) {
      setError(operationError.message || 'Nie udaĹ‚o siÄ™ zapisaÄ‡ zamĂłwienia w Firebase.');
    }
  };

  const updateOrder = async (orderId, patch) => {
    try {
      await updateOrderDocument(orderId, {
        ...patch,
        gender: patch.gender ? normalizeOrderGender(patch.gender) : undefined,
      }, currentUser);
    } catch (operationError) {
      setError(operationError.message || 'Nie udaĹ‚o siÄ™ zaktualizowaÄ‡ zamĂłwienia w Firebase.');
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await deleteOrderDocument(orderId, currentUser);
    } catch (operationError) {
      setError(operationError.message || 'Nie udaĹ‚o siÄ™ usunÄ…Ä‡ zamĂłwienia z Firebase.');
    }
  };

  const repeatOrder = async (orderId, newDate) => {
    try {
      await repeatOrderDocument(orderId, newDate, currentUser);
    } catch (operationError) {
      setError(operationError.message || 'Nie udaĹ‚o siÄ™ powtĂłrzyÄ‡ zamĂłwienia w Firebase.');
    }
  };

  const seedOrders = async () => {
    try {
      await Promise.all(orders.map(order => deleteOrderDocument(order.id, currentUser)));
      await Promise.all(SEED_ORDERS.map(order => (
        createOrderDocument(normalizeOrder({ ...order, id: order.id || generateId('order') }), currentUser)
      )));
    } catch (operationError) {
      setError(operationError.message || 'Nie udaĹ‚o siÄ™ zaĹ‚adowaÄ‡ danych testowych zamĂłwieĹ„.');
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    repeatOrder,
    seedOrders,
  };
};

