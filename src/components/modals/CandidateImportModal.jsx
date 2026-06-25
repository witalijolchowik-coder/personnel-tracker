import { useRef, useState } from 'react';
import { DEPARTMENTS } from '../../data/constants.js';
import { downloadCandidateImportTemplate, readCandidateImportFile } from '../../utils/candidateExcelUtils.js';

const assessmentTileStyles = {
  Metal: { idle: 'border-blue-500/30 text-blue-300 hover:border-blue-400/60', selected: 'border-blue-400 text-blue-200 shadow-[0_0_12px_rgba(96,165,250,0.20)]' },
  Szwalnia: { idle: 'border-violet-500/30 text-violet-300 hover:border-violet-400/60', selected: 'border-violet-400 text-violet-200 shadow-[0_0_12px_rgba(167,139,250,0.20)]' },
  Magazyn: { idle: 'border-emerald-500/30 text-emerald-300 hover:border-emerald-400/60', selected: 'border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.20)]' },
  'Podsofity/PU': { idle: 'border-cyan-500/30 text-cyan-300 hover:border-cyan-400/60', selected: 'border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.20)]' },
  Montaż: { idle: 'border-orange-500/30 text-orange-300 hover:border-orange-400/60', selected: 'border-orange-400 text-orange-200 shadow-[0_0_12px_rgba(251,146,60,0.20)]' },
};

const defaultTileStyle = {
  idle: 'border-indigo-500/30 text-indigo-300 hover:border-indigo-400/60',
  selected: 'border-indigo-400 text-indigo-200 shadow-[0_0_12px_rgba(129,140,248,0.20)]',
};

const formatAssessmentDate = date => {
  const match = String(date || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : date || 'Brak daty';
};

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
                            <div>
                              <div className="flex flex-nowrap items-stretch gap-1.5 overflow-x-auto pb-1">
                                {activeOrders.map(order => {
                                  const isSelected = row.assessmentSelection === order.id;
                                  const tileStyle = assessmentTileStyles[order.department] || defaultTileStyle;
                                  return (
                                    <button
                                      type="button"
                                      key={order.id}
                                      onClick={() => updateRow(row.rowNumber, { assessmentSelection: order.id })}
                                      className={`relative flex-none w-[112px] h-[58px] rounded-lg border bg-slate-950/70 px-2 py-1.5 text-left transition-all ${
                                        isSelected ? tileStyle.selected : tileStyle.idle
                                      }`}
                                    >
                                      {isSelected && (
                                        <span className="absolute right-1.5 top-1 text-[9px] font-black" aria-hidden="true">✓</span>
                                      )}
                                      <div className="pr-3 text-[10px] leading-tight font-black uppercase truncate">{order.department}</div>
                                      <div className="mt-0.5 text-[8px] leading-tight font-bold text-slate-400">
                                        {getOrderRealization(order)} / {order.count}
                                      </div>
                                      <div className="mt-1 flex items-center justify-between gap-1 text-[8px] leading-none text-slate-500">
                                        <span className="truncate">{formatAssessmentDate(order.assessmentDate)}</span>
                                        <span className="flex-none text-slate-400">{order.assessmentTime || '--:--'}</span>
                                      </div>
                                    </button>
                                  );
                                })}
                                <div className="w-px self-stretch bg-slate-700/80 mx-0.5 flex-none" aria-hidden="true" />
                                <button
                                  type="button"
                                  onClick={() => updateRow(row.rowNumber, {
                                    assessmentSelection: 'manual',
                                    department: row.department || DEPARTMENTS[0],
                                  })}
                                  className={`flex-none h-[58px] px-2.5 rounded-lg border text-[9px] font-bold transition-colors ${
                                    row.assessmentSelection === 'manual'
                                      ? 'bg-slate-700/70 border-slate-500 text-white'
                                      : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                                  }`}
                                >
                                  Utwórz ręcznie
                                </button>
                                {row.assessmentSelection === 'manual' && (
                                  <select
                                    value={row.department || DEPARTMENTS[0]}
                                    onChange={event => updateRow(row.rowNumber, { department: event.target.value })}
                                    className="flex-none h-[58px] px-2 bg-slate-950 border border-slate-700 rounded-lg text-[9px] text-slate-200"
                                  >
                                    {DEPARTMENTS.map(department => (
                                      <option key={department} value={department}>{department}</option>
                                    ))}
                                  </select>
                                )}
                              </div>
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
