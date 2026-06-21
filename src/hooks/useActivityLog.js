import { useEffect, useMemo, useState } from 'react';
import { clearActivityLog, subscribeToActivityLog, subscribeToActivityLogSettings } from '../services/activityLogService.js';

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
  const [entries, setEntries] = useState([]);
  const [clearedAt, setClearedAt] = useState(0);
  const [logLoading, setLogLoading] = useState(Boolean(currentUser));
  const [settingsLoading, setSettingsLoading] = useState(Boolean(currentUser));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setEntries([]);
      setLogLoading(false);
      return undefined;
    }

    setLogLoading(true);
    setError('');
    return subscribeToActivityLog(
      (nextEntries) => {
        setEntries(nextEntries);
        setLogLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message || 'Nie udało się pobrać dziennika zdarzeń.');
        setLogLoading(false);
      }
    );
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setClearedAt(0);
      setSettingsLoading(false);
      return undefined;
    }

    setSettingsLoading(true);
    setError('');
    return subscribeToActivityLogSettings(
      (settings) => {
        setClearedAt(getTimestampMillis(settings.clearedAt));
        setSettingsLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message || 'Nie udało się pobrać ustawień dziennika zdarzeń.');
        setSettingsLoading(false);
      }
    );
  }, [currentUser]);

  const activityLog = useMemo(
    () => entries.filter(entry => getTimestampMillis(entry.createdAt) > clearedAt),
    [entries, clearedAt]
  );

  const clearActivityLogView = async () => {
    if (!currentUser) return;
    setClearedAt(Date.now());

    try {
      await clearActivityLog();
    } catch (operationError) {
      setError(operationError.message || 'Nie udało się wyczyścić dziennika zdarzeń.');
    }
  };

  return {
    activityLog,
    loading: logLoading || settingsLoading,
    error,
    clearActivityLogView,
  };
};
