import Icons from '../ui/Icons.jsx';
import { DEPARTMENT_STYLES, STATUS_OPTIONS_BY_STAGE } from '../../data/constants.js';
import { formatCandidateAgeLabel, getCandidateAge } from '../../utils/candidateDisplayUtils.js';

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const stageStyles = {
  assessment: {
    icon: Icons.Calendar,
    shortLabel: 'AC',
    bar: 'bg-blue-950/30 border-blue-500/30 text-blue-200 shadow-[0_0_14px_rgba(59,130,246,0.08)]',
    dot: 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.50)]',
    label: 'text-blue-200',
    historyIcon: 'text-blue-400',
  },
  medical: {
    icon: Icons.Check,
    shortLabel: 'Badania',
    bar: 'bg-amber-950/25 border-amber-500/30 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.08)]',
    dot: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.45)]',
    label: 'text-amber-200',
    historyIcon: 'text-amber-400',
  },
  bhp: {
    icon: Icons.Briefcase,
    shortLabel: 'BHP',
    bar: 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.10)]',
    dot: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.50)]',
    label: 'text-emerald-200',
    historyIcon: 'text-emerald-400',
  },
};

const formatDisplayDate = (date) => {
  if (!date) return '';
  const [year, month, day] = String(date).split('-');
  return year && month && day ? `${day}.${month}.${year}` : date;
};

const formatDisplayDateTime = (date, time) => {
  const displayDate = formatDisplayDate(date);
  if (displayDate && time) return `${displayDate} | ${time}`;
  if (displayDate) return displayDate;
  return time || 'Nie ustalono';
};

const getCurrentTermParts = (candidate) => {
  if (candidate.stage === 'bhp') {
    return { date: formatDisplayDate(candidate.bhpDate) || 'Nie ustalono', time: candidate.bhpTime || '' };
  }
  if (candidate.stage === 'medical') {
    return { date: formatDisplayDate(candidate.medicalDate) || 'Nie ustalono', time: '' };
  }
  return {
    date: formatDisplayDate(candidate.displayAssessmentDate) || 'Nie ustalono',
    time: candidate.displayAssessmentTime || '',
  };
};

const getHistoryItems = (candidate) => {
  const items = [];

  if (candidate.stage === 'bhp' && candidate.medicalDate) {
    items.push({ label: 'Badania', value: formatDisplayDate(candidate.medicalDate), icon: Icons.Check, tone: stageStyles.medical.historyIcon });
  }

  if ((candidate.stage === 'medical' || candidate.stage === 'bhp') && candidate.displayAssessmentDate) {
    items.push({
      label: 'Data AC',
      value: formatDisplayDateTime(candidate.displayAssessmentDate, candidate.displayAssessmentTime),
      icon: Icons.Calendar,
      tone: stageStyles.assessment.historyIcon,
    });
  }

  return items;
};

export default function CandidateCard({ candidate, onStatusChange, onEdit, onDelete, onViewDetails, onRollback }) {
  const statusOptions = STATUS_OPTIONS_BY_STAGE[candidate.stage] || [];
  const fullName = [candidate.firstName, candidate.lastName].filter(Boolean).join(' ').trim();
  const age = getCandidateAge(candidate.birthDate);
  const ageLabel = age === null ? '' : formatCandidateAgeLabel(age);
  const stageTone = stageStyles[candidate.stage] || stageStyles.assessment;
  const StageIcon = stageTone.icon;
  const currentTerm = getCurrentTermParts(candidate);
  const historyItems = getHistoryItems(candidate);

  return (
    <div
      onClick={() => onViewDetails(candidate)}
      className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl hover:border-indigo-500/80 transition-all cursor-pointer group hover:shadow-lg hover:shadow-indigo-950/25 relative"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 text-indigo-300 flex items-center justify-center font-extrabold text-base border border-indigo-800/50 shadow-inner flex-none">
              {candidate.firstName[0]}{candidate.lastName[0]}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2 min-w-0">
                <h4 className="font-extrabold text-slate-100 group-hover:text-white text-[15px] transition-colors leading-tight truncate">
                  {fullName}
                </h4>
                <span className={`flex-none px-2 py-0.5 text-[10px] font-semibold rounded border ${DEPARTMENT_STYLES[candidate.department] || ''}`}>
                  {candidate.department}
                </span>
              </div>
              {ageLabel && <div className="mt-1 text-xs font-semibold text-slate-500">{ageLabel}</div>}
            </div>
          </div>

          <div className="mt-2 rounded-lg border border-blue-500/25 bg-blue-950/20 px-3 py-1.5 text-xs text-slate-200 shadow-[0_0_16px_rgba(59,130,246,0.08)] inline-flex items-center gap-2 max-w-full">
            <Icons.Phone />
            <span className="font-semibold tracking-wide truncate">{candidate.phone}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity" onClick={(event) => event.stopPropagation()}>
          {candidate.stage !== 'assessment' && (
            <button
              onClick={(event) => onRollback(candidate, event)}
              className="w-7 h-7 flex items-center justify-center text-amber-500 hover:text-amber-400 hover:bg-slate-900 border border-slate-800 rounded-lg transition-all"
              title="Cofnij etap"
            >
              <Icons.Undo />
            </button>
          )}
          <button
            onClick={(event) => onEdit(candidate, event)}
            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-slate-900 border border-slate-800 rounded-lg transition-all"
            title="Edytuj dane"
          >
            <Icons.Edit />
          </button>
          <button
            onClick={(event) => onDelete(candidate.id, event)}
            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-slate-900 border border-slate-800 rounded-lg transition-all"
            title="Usuń"
          >
            <Icons.Trash />
          </button>
        </div>
      </div>

      <div className="my-2.5 border-t border-slate-800/70" />

      <div className="grid grid-cols-[minmax(82px,0.75fr)_minmax(0,1.35fr)] gap-2 items-center">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full flex-none ${stageTone.dot}`} />
          <StageIcon />
          <span className={`text-sm font-black tracking-wide truncate ${stageTone.label}`}>
            {stageTone.shortLabel}
          </span>
        </div>
        <div className={`rounded-xl border px-2.5 py-2 flex items-center gap-2 text-[13px] font-bold min-w-0 ${stageTone.bar}`}>
          <Icons.Calendar />
          <span className="truncate">{currentTerm.date}</span>
          {currentTerm.time && (
            <>
              <span className="h-5 w-px bg-current/35 flex-none" />
              <ClockIcon />
              <span className="truncate">{currentTerm.time}</span>
            </>
          )}
        </div>
      </div>

      {historyItems.length > 0 && (
        <div className="mt-2.5 border-t border-slate-800/70">
          <div className="pt-2 pb-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">POPRZEDNIE ETAPY</div>
          {historyItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div key={item.label} className="py-1.5 border-b border-slate-800/55 last:border-b-0 flex items-center justify-between gap-3 text-xs">
                <div className={`flex items-center gap-2 ${item.tone || 'text-slate-400'}`}>
                  <ItemIcon />
                  <span className="font-semibold text-slate-300">{item.label}</span>
                </div>
                <span className="text-slate-500 font-semibold text-right">{item.value}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-2.5 pt-2.5 border-t border-slate-800/70" onClick={(event) => event.stopPropagation()}>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.18em] mb-1">STATUS</label>
        <select
          className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm font-semibold text-slate-200 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          value={candidate.status}
          onChange={(event) => onStatusChange(candidate, event.target.value)}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
