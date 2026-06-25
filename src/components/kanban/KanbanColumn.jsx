import Icons from '../ui/Icons.jsx';
import CandidateCard from '../candidates/CandidateCard.jsx';

const styles = {
  assessment: { border: 'border-t-blue-500', dot: 'bg-blue-500', count: 'bg-blue-900/40 text-blue-300 border-blue-500/20' },
  medical: { border: 'border-t-amber-500', dot: 'bg-amber-500', count: 'bg-amber-900/40 text-amber-300 border-amber-500/20' },
  bhp: { border: 'border-t-emerald-500', dot: 'bg-emerald-500', count: 'bg-emerald-900/40 text-emerald-300 border-emerald-500/20' },
};

export default function KanbanColumn({ stage, title, candidates, onStatusChange, onEdit, onDelete, onViewDetails, onRollback, onAddCandidate, onImport, onExport }) {
  const tone = styles[stage];
  return (
    <div className={`bg-slate-900 border-t-4 ${tone.border} border-x border-b border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-xl transition-all duration-300`}>
      <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${tone.dot} animate-pulse`} /><h3 className="font-bold text-slate-200 text-sm tracking-wide">{title}</h3></div>
        <div className="flex items-center gap-1.5">
          {stage === 'assessment' && (
            <button
              type="button"
              onClick={onImport}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/70 text-slate-500 hover:text-blue-300 hover:border-blue-500/30 transition-colors"
              title="Importuj kandydatów z Excel"
            >
              <Icons.Import />
            </button>
          )}
          <button
            type="button"
            onClick={() => onExport(stage)}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/70 text-slate-500 hover:text-indigo-300 hover:border-indigo-500/30 transition-colors"
            title="Eksportuj kandydatów do Excel"
          >
            <Icons.Export />
          </button>
          {stage === 'assessment' && (
            <button
              type="button"
              onClick={onAddCandidate}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/70 text-slate-500 hover:text-blue-300 hover:border-blue-500/30 transition-colors"
              title="Dodaj kandydata"
              aria-label="Dodaj kandydata"
            >
              <Icons.Plus />
            </button>
          )}
          <span className={`${tone.count} border text-xs font-bold px-2.5 py-0.5 rounded-full`}>{candidates.length}</span>
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col gap-3 min-h-[350px] max-h-[500px] overflow-y-auto bg-slate-900/40">
        {candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-slate-600"><p className="text-xs font-medium">Brak kandydatów na tym etapie</p></div>
        ) : candidates.map(candidate => (
          <CandidateCard key={candidate.id} candidate={candidate} onStatusChange={onStatusChange} onEdit={onEdit} onDelete={onDelete} onViewDetails={onViewDetails} onRollback={onRollback} />
        ))}
      </div>
    </div>
  );
}
