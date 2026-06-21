const getAgeLabel = (age) => {
  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;
  const suffix = lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14) ? 'lata' : 'lat';
  return `${age} ${suffix}`;
};

export const getCandidateAge = (birthDate, now = new Date()) => {
  if (!birthDate) return null;
  const parsedBirthDate = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(parsedBirthDate.getTime())) return null;

  let age = now.getFullYear() - parsedBirthDate.getFullYear();
  const hasBirthdayPassed = (
    now.getMonth() > parsedBirthDate.getMonth()
    || (now.getMonth() === parsedBirthDate.getMonth() && now.getDate() >= parsedBirthDate.getDate())
  );

  if (!hasBirthdayPassed) age -= 1;
  return age >= 0 ? age : null;
};

export const formatCandidateDisplayName = (candidate) => {
  const fullName = [candidate.firstName, candidate.lastName].filter(Boolean).join(' ').trim();
  const age = getCandidateAge(candidate.birthDate);
  return age === null ? fullName : `${fullName}, ${getAgeLabel(age)}`;
};
