import { useEffect, useMemo, useState } from 'react';
import { STAGE_LABELS } from '../../data/constants.js';
import { exportCandidatesToExcel } from '../../utils/candidateExcelUtils.js';

const exportFileNames = {
  assessment: 'kandydaci_assessment.xlsx',
  medical: 'kandydaci_badania.xlsx',
  bhp: 'kandydaci_bhp.xlsx',
};

export default function CandidateExportModal({ stage, candidates, onClose }) {
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    setSelectedIds([]);
  }, [stage]);

  const selectedCandidates = useMemo(
    () => candidates.filter(candidate => selectedIds.includes(candidate.id)),
    [candidates, selectedIds]
  );

  if (!stage) return null;

  const allSelected = candidates.length > 0 && selectedIds.length === candidates.length;
  const toggleAll = () => setSelectedIds(allSelected ? [] : candidates.map(candidate => candidate.id));
  const toggleCandidate = (candidateId) => setSelectedIds(currentIds => (
    currentIds.includes(candidateId)
      ? currentIds.filter(id => id !== candidateId)
      : [...currentIds, candidateId]
  ));

  const exportSelected = () => {
    if (selectedCandidates.length === 0) return;
    exportCandidatesToExcel(selectedCandidates, exportFileNames[stage]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Eksport kandydatów — {STAGE_LABELS[stage]}</h3>
            <p className="text-xs text-slate-500 mt-1">Wybierz osoby, które mają znaleźć się w pliku Excel.</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-xl px-2">&times;</button>
        </div>

        <div className="p-5">
          <label className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold text-slate-300">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-indigo-500" />
            Zaznacz wszystkich
          </label>

          <div className="mt-2 max-h-[430px] overflow-y-auto divide-y divide-slate-800/70">
            {candidates.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">Brak kandydatów w tej kolumnie.</div>
            ) : candidates.map(candidate => (
              <label key={candidate.id} className="flex items-center gap-3 py-3 cursor-pointer hover:bg-slate-950/30 px-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(candidate.id)}
                  onChange={() => toggleCandidate(candidate.id)}
                  className="accent-indigo-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-100 truncate">{candidate.firstName} {candidate.lastName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {candidate.phone}{candidate.birthDate ? ` · ${candidate.birthDate}` : ''}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/30 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold">Anuluj</button>
          <button
            type="button"
            disabled={selectedCandidates.length === 0}
            onClick={exportSelected}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Eksportuj ({selectedCandidates.length})
          </button>
        </div>
      </div>
    </div>
  );
}
