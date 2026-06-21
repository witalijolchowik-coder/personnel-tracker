import { useEffect, useState } from 'react';
import { subscribeToActivityLog } from '../services/activityLogService.js';

const getClearStorageKey = (userId) => `personnel-tracker.activityLogClearedAt.${userId}`;

const getTimestampMillis = (value) => {
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'string') {
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
  }
  return 0;
};

export const useActivityLog = (currentUser) => {
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [error, setError] = useState('');
  const [clearedAt, setClearedAt] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setClearedAt(null);
      return;
    }

    const storedValue = window.localStorage.getItem(getClearStorageKey(currentUser.uid));
    setClearedAt(Number(storedValue) || 0);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setActivityLog([]);
      setLoading(false);
      return undefined;
    }

    if (clearedAt === null) {
      setLoading(true);
      return undefined;
    }

    setLoading(true);
    setError('');
    return subscribeToActivityLog(
      (entries) => {
        setActivityLog(entries.filter(entry => getTimestampMillis(entry.createdAt) > clearedAt));
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message || 'Nie udało się pobrać dziennika zdarzeń.');
        setLoading(false);
      }
    );
  }, [currentUser, clearedAt]);

  const clearActivityLogView = () => {
    if (!currentUser) return;

    const nextClearedAt = Date.now();
    window.localStorage.setItem(getClearStorageKey(currentUser.uid), String(nextClearedAt));
    setClearedAt(nextClearedAt);
    setActivityLog([]);
  };

  return { activityLog, loading, error, clearActivityLogView };
};
