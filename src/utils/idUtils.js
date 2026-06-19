export const generateId = (prefix) => {
  const randomId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);

  return prefix ? prefix + '_' + randomId : randomId;
};
