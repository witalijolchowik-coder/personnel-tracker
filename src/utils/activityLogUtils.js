import { getCurrentIsoString } from './dateUtils.js';
import { generateId } from './idUtils.js';

export const createActivityLogEntry = ({
  actionType,
  entityType,
  entityId,
  previousValue = null,
  newValue = null,
  userId = null,
  userEmail = null,
}) => ({
  id: generateId('activity'),
  actionType,
  entityType,
  entityId,
  previousValue,
  newValue,
  userId,
  userEmail,
  createdAt: getCurrentIsoString(),
});
