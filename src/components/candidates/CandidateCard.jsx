import Icons from '../ui/Icons.jsx';
import { DEPARTMENT_STYLES, STATUS_OPTIONS_BY_STAGE } from '../../data/constants.js';
import { formatDateTime } from '../../utils/dateUtils.js';

        export default function CandidateCard({ candidate, onStatusChange, onEdit, onDelete, onViewDetails, onRollback }) {
            const statusOptions = STATUS_OPTIONS_BY_STAGE[candidate.stage] || [];

            return (
                <div 
onClick={() => onViewDetails(candidate)}
className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl hover:border-indigo-500/80 transition-all cursor-pointer group hover:shadow-lg hover:shadow-indigo-950/25 relative"
                >

<div className="flex items-start justify-between gap-2 mb-3">
    <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-950/80 text-indigo-300 flex items-center justify-center font-bold text-sm border border-indigo-900/40">
            {candidate.firstName[0]}{candidate.lastName[0]}
        </div>
        <div>
            <h4 className="font-bold text-slate-100 group-hover:text-white text-sm transition-colors leading-tight">
                {candidate.firstName} {candidate.lastName}
            </h4>
            <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded border ${DEPARTMENT_STYLES[candidate.department] || ''}`}>
                {candidate.department}
            </span>
        </div>
    </div>

    {/* Opcje akcji karty */}
    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
        {candidate.stage !== 'assessment' && (
            <button 
                onClick={(e) => onRollback(candidate, e)}
                className="p-1 text-amber-500 hover:text-amber-450 hover:bg-slate-900 rounded transition-all"
                title="Cofnij etap (Anuluj błędną akcję)"
            >
                <Icons.Undo />
            </button>
        )}
        <button 
            onClick={(e) => onEdit(candidate, e)}
            className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-900 rounded transition-all"
            title="Edytuj dane"
        >
            <Icons.Edit />
        </button>
        <button 
            onClick={(e) => onDelete(candidate.id, e)}
            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded transition-all"
            title="Usuń"
        >
            <Icons.Trash />
        </button>
    </div>
</div>

<div className="space-y-1.5 mb-4 text-xs text-slate-400">
    <div className="flex items-center gap-1.5">
        <Icons.Phone />
        <span>{candidate.phone}</span>
    </div>
    {candidate.stage === 'bhp' ? (
        <>
            <div className="flex items-center gap-1.5">
                <Icons.Calendar />
                <span>Data BHP: {formatDateTime(candidate.bhpDate, candidate.bhpTime)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
                <Icons.Calendar />
                <span>Data AC: {formatDateTime(candidate.displayAssessmentDate, candidate.displayAssessmentTime)}</span>
            </div>
            {candidate.medicalDate && (
                <div className="flex items-center gap-1.5 text-slate-500">
                    <Icons.Check />
                    <span>Badania: {candidate.medicalDate}</span>
                </div>
            )}
        </>
    ) : (
        <>
            <div className="flex items-center gap-1.5">
                <Icons.Calendar />
                <span>Data AC: {formatDateTime(candidate.displayAssessmentDate, candidate.displayAssessmentTime)}</span>
            </div>
            {candidate.medicalDate && (
                <div className="flex items-center gap-1.5 text-slate-500">
                    <Icons.Check />
                    <span>Badania: {candidate.medicalDate}</span>
                </div>
            )}
        </>
    )}
</div>

<div className="pt-3 border-t border-slate-900/85" onClick={(e) => e.stopPropagation()}>
    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Zmień status kandydata</label>
    <select 
        className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        value={candidate.status}
        onChange={(e) => onStatusChange(candidate, e.target.value)}
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
