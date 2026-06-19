export const calculateOrderRealization = (order, candidates) => (
  candidates.filter(candidate => (
    candidate.orderId === order.id
    || (
      !candidate.orderId
      && order.assessmentDate
      && candidate.department === order.department
      && candidate.assessmentDate === order.assessmentDate
    )
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
    .filter(order => !order.assessmentDate || order.assessmentDate >= todayDateStr)
    .sort((a, b) => {
      if (!a.assessmentDate && !b.assessmentDate) return 0;
      if (!a.assessmentDate) return 1;
      if (!b.assessmentDate) return -1;
      return new Date(a.assessmentDate) - new Date(b.assessmentDate);
    }),
  inactiveOrders: orders
    .filter(order => order.assessmentDate && order.assessmentDate < todayDateStr)
    .sort((a, b) => new Date(b.assessmentDate) - new Date(a.assessmentDate))
    .slice(0, 2),
});

export const getOrderForCandidate = (candidate, orders) => (
  candidate.orderId ? orders.find(order => order.id === candidate.orderId) || null : null
);

export const getCandidateAssessmentDate = (candidate, orders) => {
  const order = getOrderForCandidate(candidate, orders);
  return candidate.orderId && order ? order.assessmentDate || '' : candidate.assessmentDate || '';
};

export const getCandidateAssessmentTime = (candidate, orders) => {
  const order = getOrderForCandidate(candidate, orders);
  return candidate.orderId && order ? order.assessmentTime || '' : candidate.assessmentTime || '';
};
