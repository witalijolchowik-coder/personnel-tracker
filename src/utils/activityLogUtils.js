import { getCurrentIsoString } from './dateUtils.js';
import { generateId } from './idUtils.js';

const candidateName = (value) => {
  if (!value) return '';
  return [value.firstName, value.lastName].filter(Boolean).join(' ').trim();
};

const orderName = (value) => {
  if (!value) return '';
  return value.department ? `${value.department} (${value.count || 0} os.)` : '';
};

export const getUserFirstName = (email = '') => {
  const firstPart = String(email).split('@')[0].split('.')[0] || 'Użytkownik';
  return firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase();
};

export const getActivityKind = (entry) => {
  const actionType = entry.actionType || entry.type || '';
  const previousValue = entry.previousValue || {};
  const newValue = entry.newValue || {};

  if (actionType.startsWith('order_')) return 'order';
  if (actionType === 'candidate_assign_bhp') return 'bhp';
  if (actionType === 'candidate_send_to_reserve' || actionType === 'candidate_restore' || actionType === 'candidate_rollback') return 'archive';
  if (newValue.stage === 'hired' || newValue.status === 'Zatrudniony') return 'bhp';
  if (
    Object.prototype.hasOwnProperty.call(newValue, 'bhpDate')
    || Object.prototype.hasOwnProperty.call(newValue, 'bhpTime')
  ) return 'bhp';
  if (
    Object.prototype.hasOwnProperty.call(newValue, 'medicalDate')
    && previousValue.medicalDate !== newValue.medicalDate
  ) return 'medical';
  if (newValue.stage === 'reserve' || newValue.stage === 'rejected') return 'archive';
  return 'candidate';
};

export const getActivityMarker = (kind) => ({
  candidate: '🔵',
  order: '🟣',
  medical: '🟠',
  bhp: '🟢',
  archive: '⚪',
}[kind] || '⚪');

export const buildActivityDescription = ({ actionType, entityType, previousValue = null, newValue = null }) => {
  const previous = previousValue || {};
  const next = newValue || {};
  const name = entityType === 'order' ? orderName(next) || orderName(previous) : candidateName(next) || candidateName(previous);
  const lineBreak = name ? `\n${name}` : '';

  if (actionType === 'candidate_create') return `Dodał kandydata${lineBreak}`;
  if (actionType === 'candidate_update') {
    if (Object.prototype.hasOwnProperty.call(next, 'bhpDate') || Object.prototype.hasOwnProperty.call(next, 'bhpTime')) return `Zmienił termin BHP${lineBreak}`;
    if (Object.prototype.hasOwnProperty.call(next, 'medicalDate')) return `Zmienił termin badań${lineBreak}`;
    return `Edytował kandydata${lineBreak}`;
  }
  if (actionType === 'candidate_delete') return `Usunął kandydata${lineBreak}`;
  if (actionType === 'candidate_assign_bhp') return `Wyznaczył termin BHP${lineBreak}`;
  if (actionType === 'candidate_send_to_reserve') return `Przeniósł do rezerwy${lineBreak}`;
  if (actionType === 'candidate_restore') return `Przywrócił kandydata${lineBreak}`;
  if (actionType === 'candidate_rollback') return `Cofnął etap kandydata${lineBreak}`;
  if (actionType === 'candidate_status_change' || actionType === 'candidate_stage_change' || actionType === 'candidate_workflow') {
    if (next.stage === 'hired' || next.status === 'Zatrudniony') return `Zatrudnił kandydata${lineBreak}`;
    if (Object.prototype.hasOwnProperty.call(next, 'medicalDate')) return `Ustawił termin badań${lineBreak}`;
    if (next.stage === 'reserve') return `Przeniósł do rezerwy${lineBreak}`;
    return `Zmienił status kandydata${lineBreak}`;
  }

  if (actionType === 'order_create') return `Utworzył zamówienie${lineBreak}`;
  if (actionType === 'order_update') return `Edytował zamówienie${lineBreak}`;
  if (actionType === 'order_repeat') return `Powtórzył zamówienie${lineBreak}`;
  if (actionType === 'order_delete') return `Usunął zamówienie${lineBreak}`;

  return `Wykonał operację w systemie${lineBreak}`;
};

export const getActivityLogDisplayModel = (entry) => {
  const kind = getActivityKind(entry);
  return {
    kind,
    marker: getActivityMarker(kind),
    userName: entry.userName || getUserFirstName(entry.userEmail),
    description: entry.description || buildActivityDescription(entry),
  };
};

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === 'function') return value.toDate();
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const isSameLocalDay = (firstDate, secondDate) => (
  firstDate.getFullYear() === secondDate.getFullYear()
  && firstDate.getMonth() === secondDate.getMonth()
  && firstDate.getDate() === secondDate.getDate()
);

const padDatePart = (value) => String(value).padStart(2, '0');

export const formatActivityTime = (createdAt, now = new Date()) => {
  const createdDate = toDate(createdAt);
  if (!createdDate) return '';

  if (!isSameLocalDay(createdDate, now)) {
    return `${padDatePart(createdDate.getDate())}.${padDatePart(createdDate.getMonth() + 1)}.${createdDate.getFullYear()}`;
  }

  const diffSeconds = Math.max(0, Math.floor((now.getTime() - createdDate.getTime()) / 1000));
  if (diffSeconds < 60) return `${diffSeconds || 1} sek. temu`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} min temu`;

  const diffHours = Math.floor(diffMinutes / 60);
  return diffHours === 1 ? '1 godz. temu' : `${diffHours} godz. temu`;
};

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
