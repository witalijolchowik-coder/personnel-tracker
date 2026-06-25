import { useEffect, useMemo, useState } from 'react';
import { DEPARTMENTS, STAGE_LABELS } from '../../data/constants.js';
import { exportCandidatesToExcel } from '../../utils/candidateExcelUtils.js';

const exportFileNames = {
  assessment: 'kandydaci_assessment.xlsx',
  medical: 'kandydaci_badania.xlsx',
  bhp: 'kandydaci_bhp.xlsx',
};

const formatOrderTerm = order => {
  const match = String(order.assessmentDate || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = match ? `${match[3]}.${match[2]}.${match[1]}` : order.assessmentDate || 'Brak daty';
  return order.assessmentTime ? `${date} · ${order.assessmentTime}` : date;
};

export default function CandidateExportModal({ stage, candidates, activeOrders, onClose }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedAssessmentIds, setSelectedAssessmentIds] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  useEffect(() => {
    setSelectedIds([]);
    setSelectedAssessmentIds([]);
    setSelectedDepartments([]);
  }, [stage]);

  const departmentFilters = useMemo(() => {
    const availableDepartments = new Set(candidates.map(candidate => candidate.department).filter(Boolean));
    const knownDepartments = DEPARTMENTS.filter(department => availableDepartments.has(department));
    const additionalDepartments = [...availableDepartments].filter(department => !DEPARTMENTS.includes(department));
    return [...knownDepartments, ...additionalDepartments];
  }, [candidates]);

  const visibleCandidates = useMemo(() => {
    if (stage === 'assessment' && selectedAssessmentIds.length > 0) {
      return candidates.filter(candidate => selectedAssessmentIds.includes(candidate.orderId));
    }
    if (stage !== 'assessment' && selectedDepartments.length > 0) {
      return candidates.filter(candidate => selectedDepartments.includes(candidate.department));
    }
    return candidates;
  }, [stage, candidates, selectedAssessmentIds, selectedDepartments]);

  const selectedCandidates = useMemo(
    () => visibleCandidates.filter(candidate => selectedIds.includes(candidate.id)),
    [visibleCandidates, selectedIds]
  );

  if (!stage) return null;

  const visibleIds = visibleCandidates.map(candidate => candidate.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id));

  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds(currentIds => currentIds.filter(id => !visibleIds.includes(id)));
      return;
    }
    setSelectedIds(currentIds => [...new Set([...currentIds, ...visibleIds])]);
  };

  const toggleCandidate = candidateId => setSelectedIds(currentIds => (
    currentIds.includes(candidateId)
      ? currentIds.filter(id => id !== candidateId)
      : [...currentIds, candidateId]
  ));

  const toggleFilter = (value, setter) => setter(currentValues => (
    currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value]
  ));

  const exportSelected = () => {
    if (selectedCandidates.length === 0) return;
    exportCandidatesToExcel(selectedCandidates, exportFileNames[stage]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Eksport kandydatów — {STAGE_LABELS[stage]}</h3>
            <p className="text-xs text-slate-500 mt-1">Wybierz osoby, które mają znaleźć się w pliku Excel.</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-xl px-2">&times;</button>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-800">
            <label className="flex items-center gap-2 mr-1 text-xs font-bold text-slate-300 whitespace-nowrap">
              <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} className="accent-indigo-500" />
              Zaznacz wszystkich
            </label>

            <span className="hidden sm:block h-6 w-px bg-slate-700 mx-1" aria-hidden="true" />

            {stage === 'assessment' ? activeOrders.map(order => {
              const active = selectedAssessmentIds.includes(order.id);
              return (
                <button
                  type="button"
                  key={order.id}
                  onClick={() => toggleFilter(order.id, setSelectedAssessmentIds)}
                  className={`px-2.5 py-1.5 rounded-lg border text-left transition-colors ${
                    active
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.14)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="block text-[9px] font-black uppercase leading-tight">{order.department}</span>
                  <span className="block mt-0.5 text-[8px] leading-tight opacity-80">{formatOrderTerm(order)}</span>
                </button>
              );
            }) : departmentFilters.map(department => {
              const active = selectedDepartments.includes(department);
              return (
                <button
                  type="button"
                  key={department}
                  onClick={() => toggleFilter(department, setSelectedDepartments)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-bold transition-colors ${
                    active
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.14)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {department}
                </button>
              );
            })}
          </div>

          <div className="mt-2 max-h-[430px] overflow-y-auto divide-y divide-slate-800/70">
            {visibleCandidates.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">Brak kandydatów dla wybranych filtrów.</div>
            ) : visibleCandidates.map(candidate => (
              <label key={candidate.id} className="flex items-center gap-3 py-3 cursor-pointer hover:bg-slate-950/30 px-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(candidate.id)}
                  onChange={() => toggleCandidate(candidate.id)}
                  className="accent-indigo-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-100 truncate">
                    {candidate.firstName} {candidate.lastName}
                    <span className="font-normal text-slate-500"> · {candidate.birthDate || 'Brak daty urodzenia'}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 truncate">
                    {candidate.phone || 'Brak telefonu'} · {candidate.department || 'Brak działu'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/30 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Widoczni: {visibleCandidates.length} · Zaznaczeni: {selectedCandidates.length}
          </div>
          <div className="flex items-center gap-2">
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
    </div>
  );
}
