import { useEffect, useState } from 'react';
import { subscribeToActivityLog } from '../services/activityLogService.js';

export const useActivityLog = (currentUser) => {
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setActivityLog([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError('');
    return subscribeToActivityLog(
      (entries) => {
        setActivityLog(entries);
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message || 'Nie udało się pobrać dziennika zdarzeń.');
        setLoading(false);
      }
    );
  }, [currentUser]);

  return { activityLog, loading, error };
};
