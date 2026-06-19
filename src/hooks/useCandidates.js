import { useEffect, useState } from 'react';
import { STAGE_LABELS } from '../data/constants.js';
import { SEED_CANDIDATES } from '../data/seedData.js';
import { createCandidateDocument, deleteCandidateDocument, subscribeToCandidates, updateCandidateDocument } from '../services/firestoreCandidateService.js';
import { createCandidateHistoryEntry } from '../utils/candidateWorkflow.js';
import { generateId } from '../utils/idUtils.js';

const EDIT_HISTORY_FIELDS = ['firstName', 'lastName', 'birthDate', 'phone', 'department', 'orderId', 'assessmentDate', 'assessmentTime'];

const hasChangedFields = (candidate, patch, fields) => fields.some(field => (
  Object.prototype.hasOwnProperty.call(patch, field) && candidate[field] !== patch[field]
));

const normalizeCandidate = (candidate) => ({
  medicalDate: null,
  bhpDate: null,
  bhpTime: null,
  hireDate: null,
  orderId: null,
  assessmentTime: '',
  reserveDate: null,
  reserveStatus: null,
  rejectionStage: null,
  rejectionReason: null,
  rejectionDate: null,
  createdBy: null,
  updatedBy: null,
  ...candidate,
  id: candidate.id || generateId('candidate'),
  history: candidate.history || [],
});

const buildNewCandidate = (candidateData) => normalizeCandidate({
  ...candidateData,
  id: generateId('candidate'),
  stage: 'assessment',
  status: 'Nowy',
  history: [
    createCandidateHistoryEntry({
      fromStage: 'Brak',
      toStage: STAGE_LABELS.assessment,
      fromStatus: 'Brak',
      toStatus: 'Nowy',
      actionType: 'candidate_create',
    }),
  ],
});

const getWorkflowActionType = (previousCandidate, nextCandidate, fallbackActionType) => {
  if (fallbackActionType) return fallbackActionType;
  const latestHistoryEntry = nextCandidate.history?.[0];
  if (latestHistoryEntry?.actionType && latestHistoryEntry.actionType !== 'candidate_workflow') return latestHistoryEntry.actionType;
  if (previousCandidate.stage !== nextCandidate.stage) return 'candidate_stage_change';
  if (previousCandidate.status !== nextCandidate.status) return 'candidate_status_change';
  return 'candidate_workflow';
};

export const useCandidates = (currentUser) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setCandidates([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError('');
    return subscribeToCandidates(
      (nextCandidates) => {
        setCandidates(nextCandidates.map(normalizeCandidate));
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message || 'Nie udaĹ‚o siÄ™ pobraÄ‡ kandydatĂłw z Firebase.');
        setLoading(false);
      }
    );
  }, [currentUser]);

  const createCandidate = async (candidateData) => {
    try {
      const newCandidate = buildNewCandidate(candidateData);
      await createCandidateDocument(newCandidate, currentUser);
      return newCandidate;
    } catch (operationError) {
      setError(operationError.message || 'Nie udaĹ‚o siÄ™ zapisaÄ‡ kandydata w Firebase.');
    }
  };

  const updateCandidate = async (candidateId, patch) => {
    try {
      const candidate = candidates.find(item => item.id === candidateId);
      if (!candidate) return;
      const resolvedPatch = typeof patch === 'function' ? patch(candidate) : patch;
      if (!resolvedPatch) return;

      const history = hasChangedFields(candidate, resolvedPatch, EDIT_HISTORY_FIELDS)
        ? [
            createCandidateHistoryEntry({
              fromStage: STAGE_LABELS[candidate.stage],
              toStage: STAGE_LABELS[candidate.stage],
              fromStatus: candidate.status,
              toStatus: 'Zaktualizowano dane personalne',
              actionType: 'candidate_update',
            }),
            ...(candidate.history || []),
          ]
        : candidate.history;

      await updateCandidateDocument(candidateId, { ...resolvedPatch, history }, currentUser, 'candidate_update');
    } catch (operationError) {
      setError(operationError.message || 'Nie udaĹ‚o siÄ™ zaktualizowaÄ‡ kandydata w Firebase.');
    }
  };

  const deleteCandidate = async (candidateId) => {
    try {
      await deleteCandidateDocument(candidateId, currentUser);
    } catch (operationError) {
      setError(operationError.message || 'Nie udaĹ‚o siÄ™ usunÄ…Ä‡ kandydata z Firebase.');
    }
  };

  const applyCandidateWorkflow = async (candidateId, workflowResult, actionType) => {
    try {
      const candidate = candidates.find(item => item.id === candidateId);
      if (!candidate) return;
      const resolvedCandidate = typeof workflowResult === 'function' ? workflowResult(candidate) : workflowResult;
      if (!resolvedCandidate || resolvedCandidate === candidate) return;
      await updateCandidateDocument(
        candidateId,
        resolvedCandidate,
        currentUser,
        getWorkflowActionType(candidate, resolvedCandidate, actionType)
      );
    } catch (operationError) {
      setError(operationError.message || 'Nie udaĹ‚o siÄ™ zapisaÄ‡ zmiany statusu w Firebase.');
    }
  };

  const restoreCandidate = (candidateId, patch) => applyCandidateWorkflow(candidateId, patch, 'candidate_restore');

  const rollbackCandidate = (candidateId, patch) => applyCandidateWorkflow(candidateId, patch, 'candidate_rollback');

  const seedCandidates = async () => {
    try {
      await Promise.all(candidates.map(candidate => deleteCandidateDocument(candidate.id, currentUser)));
      await Promise.all(SEED_CANDIDATES.map(candidate => (
        createCandidateDocument(normalizeCandidate({ ...candidate, id: candidate.id || generateId('candidate') }), currentUser)
      )));
    } catch (operationError) {
      setError(operationError.message || 'Nie udaĹ‚o siÄ™ zaĹ‚adowaÄ‡ danych testowych kandydatĂłw.');
    }
  };

  return {
    candidates,
    loading,
    error,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    applyCandidateWorkflow,
    restoreCandidate,
    rollbackCandidate,
    seedCandidates,
  };
};

