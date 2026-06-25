import { useRef, useState } from 'react';
import { DEPARTMENTS } from '../../data/constants.js';
import { downloadCandidateImportTemplate, readCandidateImportFile } from '../../utils/candidateExcelUtils.js';
import { formatDateTime } from '../../utils/dateUtils.js';

export default function CandidateImportModal({ isOpen, activeOrders, getOrderRealization, onClose, onImport }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState([]);
  const [fileError, setFileError] = useState('');
  const [importing, setImporting] = useState(false);

  if (!isOpen) return null;

  const closeModal = () => {
    setFileName('');
    setRows([]);
    setFileError('');
    setImporting(false);
    onClose();
  };

  const updateRow = (rowNumber, patch) => {
    setRows(currentRows => currentRows.map(row => (
      row.rowNumber === rowNumber ? { ...row, ...patch } : row
    )));
  };

  const handleFile = async (file) => {
    if (!file) return;
    setFileError('');
    setFileName(file.name);
    try {
      setRows(await readCandidateImportFile(file));
    } catch (error) {
      setRows([]);
      setFileError(error.message || 'Nie udało się odczytać pliku Excel.');
    }
  };

  const importableRows = rows.filter(row => !row.skipped && row.errors.length === 0);
  const hasBlockingRows = rows.some(row => (
    !row.skipped && (row.errors.length > 0 || !row.assessmentSelection)
  ));
  const canImport = importableRows.length > 0 && !hasBlockingRows && !importing;

  const submitImport = async () => {
    if (!canImport) return;
    setImporting(true);
    await onImport(importableRows, rows.length - importableRows.length);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/90 backdrop-blur-sm p-3 sm:p-6">
      <div className="min-h-full flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/70 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Import kandydatów</h3>
              <p className="text-xs text-slate-500 mt-1">Import do etapu Assessment / Testy (AC)</p>
            </div>
            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-white text-xl px-2">&times;</button>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-300">Wymagane kolumny</div>
                <div className="text-xs text-slate-500 mt-1">Imię, Nazwisko, Data urodzenia, Telefon</div>
                {fileName && <div className="text-xs text-indigo-300 mt-2">Wybrano: {fileName}</div>}
                {fileError && <div className="text-xs text-rose-300 mt-2">{fileError}</div>}
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={event => handleFile(event.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Wybierz plik
                </button>
                <button
                  type="button"
                  onClick={downloadCandidateImportTemplate}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors"
                >
                  Pobierz szablon
                </button>
              </div>
            </div>

            {rows.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full min-w-[980px] text-left">
                  <thead className="bg-slate-950/80 text-[10px] uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="p-3">Imię</th>
                      <th className="p-3">Nazwisko</th>
                      <th className="p-3">Data urodzenia</th>
                      <th className="p-3">Telefon</th>
                      <th className="p-3 min-w-[360px]">Assessment</th>
                      <th className="p-3">Wiersz</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs">
                    {rows.map(row => (
                      <tr key={row.rowNumber} className={row.skipped ? 'opacity-45 bg-slate-950/40' : 'bg-slate-900/50'}>
                        <td className="p-3 text-slate-200">{row.firstName || '-'}</td>
                        <td className="p-3 text-slate-200">{row.lastName || '-'}</td>
                        <td className="p-3 text-slate-400">{row.birthDate || '-'}</td>
                        <td className="p-3 text-slate-300">{row.phone || '-'}</td>
                        <td className="p-3">
                          {!row.skipped && row.errors.length === 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {activeOrders.map(order => (
                                <button
                                  type="button"
                                  key={order.id}
                                  onClick={() => updateRow(row.rowNumber, { assessmentSelection: order.id })}
                                  className={`px-2 py-1 rounded-md border text-[9px] font-bold transition-colors ${
                                    row.assessmentSelection === order.id
                                      ? 'bg-indigo-600/25 border-indigo-500 text-indigo-200'
                                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                                  }`}
                                >
                                  {order.department} · {formatDateTime(order.assessmentDate, order.assessmentTime)}
                                  {' · '}{getOrderRealization(order)}/{order.count}
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => updateRow(row.rowNumber, {
                                  assessmentSelection: 'manual',
                                  department: row.department || DEPARTMENTS[0],
                                })}
                                className={`px-2 py-1 rounded-md border text-[9px] font-bold transition-colors ${
                                  row.assessmentSelection === 'manual'
                                    ? 'bg-indigo-600/25 border-indigo-500 text-indigo-200'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                                }`}
                              >
                                Ręcznie
                              </button>
                              {row.assessmentSelection === 'manual' && (
                                <select
                                  value={row.department || DEPARTMENTS[0]}
                                  onChange={event => updateRow(row.rowNumber, { department: event.target.value })}
                                  className="px-2 py-1 bg-slate-950 border border-slate-700 rounded-md text-[9px] text-slate-200"
                                >
                                  {DEPARTMENTS.map(department => (
                                    <option key={department} value={department}>{department}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                          )}
                          {!row.skipped && row.errors.length > 0 && (
                            <div className="text-rose-300">{row.errors.join(', ')}</div>
                          )}
                        </td>
                        <td className="p-3">
                          <label className="flex items-center gap-2 text-slate-400 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={row.skipped}
                              onChange={event => updateRow(row.rowNumber, { skipped: event.target.checked })}
                              className="accent-indigo-500"
                            />
                            Pomiń #{row.rowNumber}
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Poprawne: {importableRows.length} · Pominięte: {rows.filter(row => row.skipped).length}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold">Anuluj</button>
              <button
                type="button"
                disabled={!canImport}
                onClick={submitImport}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg text-xs font-bold transition-colors"
              >
                {importing ? 'Importowanie...' : 'Utwórz kandydatów'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
