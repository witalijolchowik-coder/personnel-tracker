const pad = value => String(value).padStart(2, '0');

const buildDate = (year, month, day) => {
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const numericDay = Number(day);
  if (!numericYear || numericMonth < 1 || numericMonth > 12 || numericDay < 1 || numericDay > 31) return null;

  const date = new Date(numericYear, numericMonth - 1, numericDay);
  if (
    date.getFullYear() !== numericYear
    || date.getMonth() !== numericMonth - 1
    || date.getDate() !== numericDay
  ) return null;

  return `${numericYear}-${pad(numericMonth)}-${pad(numericDay)}`;
};

export const parseFlexibleDate = (input) => {
  const value = String(input || '').trim();
  if (!value) return '';

  let match = value.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/);
  if (match) return buildDate(match[1], match[2], match[3]);

  match = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2}|\d{4})$/);
  if (!match) return null;

  let first = Number(match[1]);
  let second = Number(match[2]);
  let year = Number(match[3]);
  if (year < 100) year += 2000;

  if (first <= 12 && second > 12) {
    return buildDate(year, first, second);
  }

  return buildDate(year, second, first);
};

export const parseFlexibleTime = (input) => {
  let value = String(input || '').trim().toLowerCase();
  if (!value) return '';

  const isMorning = /\brano\b/.test(value);
  value = value.replace(/\s*rano\s*/g, '').replace('.', ':').replace(/\s+/g, '');

  let hours;
  let minutes;
  if (/^\d{1,2}$/.test(value)) {
    hours = Number(value);
    minutes = 0;
  } else if (/^\d{3,4}$/.test(value)) {
    const digits = value.padStart(4, '0');
    hours = Number(digits.slice(0, 2));
    minutes = Number(digits.slice(2));
  } else {
    const match = value.match(/^(\d{1,2}):(\d{1,2})$/);
    if (!match) return null;
    hours = Number(match[1]);
    minutes = Number(match[2]);
  }

  if (isMorning && hours === 12) hours = 0;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return `${pad(hours)}:${pad(minutes)}`;
};

export const formatDateForInput = (value) => {
  if (!value) return '';
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : value;
};
