import Icons from '../ui/Icons.jsx';
import { DEPARTMENT_STYLES } from '../../data/constants.js';
import { formatCandidateDisplayName } from '../../utils/candidateDisplayUtils.js';
import { formatDateTime } from '../../utils/dateUtils.js';

export default function CandidateDetailsModal({ candidate, onClose }) {
  if (!candidate) return null;
  const candidateDisplayName = formatCandidateDisplayName(candidate);
  return (
        <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden transform transition-all duration-300">
                
                <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Icons.History />
                        Karta szczegółowa kandydata
                    </h3>
                    <button 
                        onClick={() => onClose()} 
                        className="text-slate-400 hover:text-white transition-colors text-xl font-semibold p-1"
                    >
                        &times;
                    </button>
                </div>
    
                <div className="p-6 space-y-6">
                    
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-lg shadow-inner">
        {candidate.firstName[0]}{candidate.lastName[0]}
    </div>
    <div>
        <h4 className="text-base font-bold text-white">{candidateDisplayName}</h4>
        <p className="text-xs text-slate-400">Data urodzenia: {candidate.birthDate || "Brak danych"}</p>
    </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
    <span className={`px-2.5 py-1 text-xs rounded border font-semibold ${DEPARTMENT_STYLES[candidate.department] || ''}`}>
        Dział: {candidate.department}
    </span>
    <span className="px-2.5 py-1 text-xs rounded border border-slate-800 bg-slate-900 text-indigo-300 font-semibold flex items-center gap-1">
        <Icons.Phone /> {candidate.phone}
    </span>
                        </div>
                    </div>
    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 text-center">
    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Data AC</div>
    <div className="text-xs font-semibold text-white">{formatDateTime(candidate.displayAssessmentDate, candidate.displayAssessmentTime)}</div>
                        </div>
                        <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 text-center">
    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Medycyna Pracy</div>
    <div className="text-xs font-semibold text-white">{candidate.medicalDate || '-'}</div>
                        </div>
                        <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 text-center">
    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Szkolenie BHP</div>
    <div className="text-xs font-semibold text-white">{formatDateTime(candidate.bhpDate, candidate.bhpTime)}</div>
                        </div>
                        <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 text-center">
    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Zatrudnienie</div>
    <div className="text-xs font-semibold text-white">{candidate.hireDate || '-'}</div>
                        </div>
                    </div>
    
                    <div>
                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Pełna chronologia działań</h4>
                        
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
    {!candidate.history || candidate.history.length === 0 ? (
        <p className="text-xs text-slate-500 italic text-center py-4">Brak logów historycznych.</p>
    ) : (
        candidate.history.map((log, index) => (
            <div key={index} className="flex gap-4 relative">
                {index < candidate.history.length - 1 && (
                    <div className="absolute left-3.5 top-7 bottom-0 w-[1px] bg-slate-800"></div>
                )}
                
                <div className="w-7 h-7 rounded-full bg-slate-950 border border-indigo-500/40 flex items-center justify-center text-slate-300 flex-shrink-0 z-10 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                </div>
    
                <div className="flex-1 bg-slate-950 p-3.5 rounded-lg border border-slate-800 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                        <span className="text-xs text-slate-400 font-bold tracking-wider">{log.timestamp}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 inline-block w-fit">
                            Status: {log.toStatus}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-200">
                        <span className="font-semibold text-slate-400">{log.fromStage}</span>
                        <Icons.ArrowRight />
                        <span className="font-semibold text-indigo-400">{log.toStage}</span>
                    </div>
                </div>
            </div>
        ))
    )}
                        </div>
                    </div>
    
                </div>
    
                <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-[10px] text-slate-500">Status ID: {candidate.id}</div>
                    <button 
                        onClick={() => onClose()}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all"
                    >
                        Zamknij podgląd
                    </button>
                </div>
    
            </div>
        </div>
  );
}
