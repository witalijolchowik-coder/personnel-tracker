import * as XLSX from 'xlsx';

export const CANDIDATE_EXCEL_HEADERS = ['Imię', 'Nazwisko', 'Data urodzenia', 'Telefon'];

const normalizeText = (value) => String(value ?? '').trim();

const padDatePart = (value) => String(value).padStart(2, '0');

const formatDateValue = (value) => {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getFullYear()}-${padDatePart(value.getMonth() + 1)}-${padDatePart(value.getDate())}`;
  }
  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    return parsed ? `${parsed.y}-${padDatePart(parsed.m)}-${padDatePart(parsed.d)}` : '';
  }

  const text = normalizeText(value);
  const isoMatch = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) return `${isoMatch[1]}-${padDatePart(isoMatch[2])}-${padDatePart(isoMatch[3])}`;

  const localMatch = text.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (localMatch) return `${localMatch[3]}-${padDatePart(localMatch[2])}-${padDatePart(localMatch[1])}`;

  const parsedDate = new Date(text);
  return Number.isNaN(parsedDate.getTime())
    ? text
    : `${parsedDate.getFullYear()}-${padDatePart(parsedDate.getMonth() + 1)}-${padDatePart(parsedDate.getDate())}`;
};

const validateRow = (row) => {
  const errors = [];
  if (!row.firstName) errors.push('Brak imienia');
  if (!row.lastName) errors.push('Brak nazwiska');
  if (!row.phone) errors.push('Brak telefonu');
  return errors;
};

export const readCandidateImportFile = async (file) => {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!firstSheet) throw new Error('Plik nie zawiera arkusza.');

  const sheetRows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
  const headers = (sheetRows[0] || []).map(normalizeText);
  const missingHeaders = CANDIDATE_EXCEL_HEADERS.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Brak wymaganych kolumn: ${missingHeaders.join(', ')}`);
  }

  const rawRows = XLSX.utils.sheet_to_json(firstSheet, { defval: '', raw: true });
  return rawRows
    .map((source, index) => {
      const row = {
        rowNumber: index + 2,
        firstName: normalizeText(source['Imię']),
        lastName: normalizeText(source['Nazwisko']),
        birthDate: formatDateValue(source['Data urodzenia']),
        phone: normalizeText(source.Telefon),
        assessmentSelection: '',
        skipped: false,
      };
      return { ...row, errors: validateRow(row) };
    })
    .filter(row => row.firstName || row.lastName || row.birthDate || row.phone);
};

const createWorkbook = (rows, sheetName) => {
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: CANDIDATE_EXCEL_HEADERS });
  worksheet['!cols'] = [{ wch: 20 }, { wch: 24 }, { wch: 16 }, { wch: 20 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return workbook;
};

export const downloadCandidateImportTemplate = () => {
  const workbook = createWorkbook([], 'Import kandydatów');
  XLSX.writeFile(workbook, 'szablon_importu_kandydatow.xlsx');
};

export const exportCandidatesToExcel = (candidates, fileName) => {
  const rows = candidates.map(candidate => ({
    'Imię': candidate.firstName || '',
    'Nazwisko': candidate.lastName || '',
    'Data urodzenia': candidate.birthDate || '',
    'Telefon': candidate.phone || '',
  }));
  const workbook = createWorkbook(rows, 'Kandydaci');
  XLSX.writeFile(workbook, fileName);
};
