export const calculateOrderRealization = (order, candidates) => (
  candidates.filter(candidate => (
    candidate.department === order.department
    && candidate.assessmentDate === order.assessmentDate
  )).length
);

export const ORDER_GENDERS = ['Mężczyźni', 'Kobiety', 'Mężczyźni i kobiety'];

export const normalizeOrderGender = (gender) => ({
  'Mężczyzna': 'Mężczyźni',
  'Kobieta': 'Kobiety',
  'Mężczyzna i kobieta': 'Mężczyźni i kobiety',
}[gender] || gender);

export const splitOrdersByActivity = (orders, todayDateStr) => ({
  activeOrders: orders
    .filter(order => order.assessmentDate >= todayDateStr)
    .sort((a, b) => new Date(a.assessmentDate) - new Date(b.assessmentDate)),
  inactiveOrders: orders
    .filter(order => order.assessmentDate < todayDateStr)
    .sort((a, b) => new Date(b.assessmentDate) - new Date(a.assessmentDate))
    .slice(0, 2),
});
