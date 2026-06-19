import { STAGE_LABELS } from '../data/constants.js';
import { getCurrentDateOnlyString, getCurrentDateTimeString } from './dateUtils.js';

export const createCandidateHistoryEntry = ({
  fromStage,
  toStage,
  fromStatus,
  toStatus,
  actionType = 'candidate_workflow',
  userId = null,
  userEmail = null,
}) => ({
  timestamp: getCurrentDateTimeString(),
  fromStage,
  toStage,
  fromStatus,
  toStatus,
  actionType,
  userId,
  userEmail,
});

export const changeCandidateStatus = (candidate, newStatus) => {
  const currentDate = getCurrentDateOnlyString();
  const fromStage = candidate.stage;
  let toStage = candidate.stage;
  const fromStatus = candidate.status;
  let toStatus = newStatus;
  let extraFields = {};

  if (fromStage === 'assessment') {
    if (newStatus === 'Potwierdzony') {
      toStage = 'medical';
      toStatus = 'Oczekuje';
    } else if (newStatus === 'Niepotwierdzony') {
      toStage = 'rejected';
      toStatus = 'Niepotwierdzony po assessment';
      extraFields = { rejectionStage: 'Assessment (AC)', rejectionReason: 'Niepotwierdzony po assessment', rejectionDate: currentDate };
    } else if (newStatus === 'Nie stawił się') {
      toStage = 'rejected';
      toStatus = 'Nie stawił się na assessment';
      extraFields = { rejectionStage: 'Assessment (AC)', rejectionReason: 'Nie stawił się na assessment', rejectionDate: currentDate };
    }
  } else if (fromStage === 'medical') {
    if (newStatus === 'Przeszedł') {
      return candidate;
    } else if (newStatus === 'Nie stawił się') {
      toStage = 'rejected';
      toStatus = 'Nie stawił się na badania';
      extraFields = { rejectionStage: 'Badania lekarskie', rejectionReason: 'Nie stawił się na badania', rejectionDate: currentDate };
    } else if (newStatus === 'Do rezerwy (Badania nieukończone)') {
      toStage = 'reserve';
      toStatus = 'Badania nieukończone';
      extraFields = { reserveStatus: 'Badania nieukończone', reserveDate: currentDate };
    } else if (newStatus === 'Do rezerwy (Badania zaliczone)') {
      toStage = 'reserve';
      toStatus = 'Badania zaliczone';
      extraFields = { reserveStatus: 'Badania zaliczone', reserveDate: currentDate, medicalDate: currentDate };
    }
  } else if (fromStage === 'bhp') {
    if (newStatus === 'Nie stawił się') {
      toStage = 'rejected';
      toStatus = 'Nie stawił się na BHP';
      extraFields = { rejectionStage: 'BHP i zatrudnienie', rejectionReason: 'Nie stawił się na BHP', rejectionDate: currentDate };
    } else if (newStatus === 'Stawił się') {
      toStatus = 'Stawił się';
      extraFields = { bhpDate: currentDate };
    } else if (newStatus === 'Zatrudniony') {
      toStage = 'hired';
      toStatus = 'Zatrudniony';
      extraFields = { bhpDate: candidate.bhpDate || currentDate, hireDate: currentDate };
    }
  }

  const historyEntry = createCandidateHistoryEntry({
    fromStage: STAGE_LABELS[fromStage],
    toStage: STAGE_LABELS[toStage],
    fromStatus,
    toStatus,
  });

  return { ...candidate, stage: toStage, status: toStatus, history: [historyEntry, ...(candidate.history || [])], ...extraFields };
};

export const rollbackCandidateStage = (candidate) => {
  let previousStage = 'assessment';
  let nextStatus = 'Nowy';
  let fieldsToClear = {};

  if (candidate.stage === 'medical') {
    previousStage = 'assessment';
    nextStatus = 'Nowy';
    fieldsToClear = { medicalDate: null };
  } else if (candidate.stage === 'bhp') {
    previousStage = 'medical';
    nextStatus = 'Oczekuje';
    fieldsToClear = { bhpDate: null };
  } else {
    return candidate;
  }

  const historyEntry = createCandidateHistoryEntry({
    fromStage: STAGE_LABELS[candidate.stage],
    toStage: STAGE_LABELS[previousStage],
    fromStatus: candidate.status,
    toStatus: 'Anulowano ostatni etap (Cofnij)',
    actionType: 'candidate_rollback',
  });

  return { ...candidate, stage: previousStage, status: nextStatus, history: [historyEntry, ...(candidate.history || [])], ...fieldsToClear };
};

export const returnToMedicalFromReserve = (candidate) => {
  const historyEntry = createCandidateHistoryEntry({
    fromStage: 'Rezerwa',
    toStage: 'Badania lekarskie',
    fromStatus: candidate.status,
    toStatus: 'Oczekuje',
    actionType: 'candidate_restore',
  });

  return { ...candidate, stage: 'medical', status: 'Oczekuje', history: [historyEntry, ...(candidate.history || [])], reserveDate: null, reserveStatus: null };
};

export const assignBhpAfterMedical = (candidate, bhpDate) => {
  const currentDate = getCurrentDateOnlyString();
  const medicalDate = candidate.medicalDate || currentDate;
  const historyEntry = createCandidateHistoryEntry({
    fromStage: 'Badania lekarskie',
    toStage: 'BHP i zatrudnienie',
    fromStatus: candidate.status,
    toStatus: 'Oczekuje, Data BHP: ' + bhpDate + ', bezpośrednio po badaniach',
    actionType: 'candidate_assign_bhp',
  });

  return {
    ...candidate,
    stage: 'bhp',
    status: 'Oczekuje',
    medicalDate,
    bhpDate,
    history: [{ ...historyEntry, bhpDate, source: 'medical' }, ...(candidate.history || [])],
  };
};

export const sendPassedMedicalToReserve = (candidate) => {
  const currentDate = getCurrentDateOnlyString();
  const medicalDate = candidate.medicalDate || currentDate;
  const historyEntry = createCandidateHistoryEntry({
    fromStage: 'Badania lekarskie',
    toStage: 'Rezerwa',
    fromStatus: candidate.status,
    toStatus: 'Badania zaliczone, BHP nie wyznaczone',
    actionType: 'candidate_send_to_reserve',
  });

  return {
    ...candidate,
    stage: 'reserve',
    status: 'Badania zaliczone',
    medicalDate,
    reserveDate: currentDate,
    reserveStatus: 'Badania zaliczone',
    history: [{ ...historyEntry, source: 'medical', bhpDate: null }, ...(candidate.history || [])],
  };
};

export const assignBhpFromReserveWithDate = (candidate, bhpDate) => {
  const historyEntry = createCandidateHistoryEntry({
    fromStage: 'Rezerwa',
    toStage: 'BHP i zatrudnienie',
    fromStatus: candidate.status,
    toStatus: 'Oczekuje, Data BHP: ' + bhpDate + ', z rezerwy',
    actionType: 'candidate_assign_bhp',
  });

  return {
    ...candidate,
    stage: 'bhp',
    status: 'Oczekuje',
    bhpDate,
    history: [{ ...historyEntry, bhpDate, source: 'reserve' }, ...(candidate.history || [])],
    reserveDate: null,
    reserveStatus: null,
  };
};

export const restoreCandidateFromRejections = (candidate, restoreNewDate) => {
  let sourceStage = 'assessment';
  let initialStatus = 'Nowy';
  let dateFields = { assessmentDate: restoreNewDate };

  if (candidate.rejectionStage === 'Badania lekarskie') {
    sourceStage = 'medical';
    initialStatus = 'Oczekuje';
    dateFields = { medicalDate: restoreNewDate };
  } else if (candidate.rejectionStage === 'BHP i zatrudnienie') {
    sourceStage = 'bhp';
    initialStatus = 'Oczekuje';
    dateFields = { bhpDate: restoreNewDate };
  }

  const historyEntry = createCandidateHistoryEntry({
    fromStage: 'Rezygnacje / Nieobecności',
    toStage: STAGE_LABELS[sourceStage],
    fromStatus: candidate.status,
    toStatus: 'Przywrócono z rezygnacji (Nowa data AC/etapu: ' + restoreNewDate + ')',
    actionType: 'candidate_restore',
  });

  return { ...candidate, stage: sourceStage, status: initialStatus, history: [historyEntry, ...(candidate.history || [])], rejectionStage: null, rejectionReason: null, rejectionDate: null, ...dateFields };
};
