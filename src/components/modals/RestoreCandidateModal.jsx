import Icons from '../ui/Icons.jsx';

export default function RestoreCandidateModal({ candidate, restoreNewDate, setRestoreNewDate, onClose, onConfirm }) {
  if (!candidate) return null;
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800/85 rounded-xl w-full max-w-md shadow-2xl p-6 transform transition-all duration-300">
        <div className="flex items-center gap-3 mb-4 text-indigo-400"><Icons.ArrowRefresh /><h3 className="text-lg font-bold text-white">Przywróć kandydata na etap</h3></div>
        <p className="text-sm text-slate-300 mb-4">Przywracanie kandydata <strong className="text-white">{candidate.firstName} {candidate.lastName}</strong> na etap <strong className="text-indigo-400">{candidate.rejectionStage || 'Assessment (AC)'}</strong>.</p>
        <div className="space-y-4 mb-6"><div><label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Wybierz nową datę etapu *</label><input type="date" required className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" value={restoreNewDate} onChange={(event) => setRestoreNewDate(event.target.value)} /></div></div>
        <div className="flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold rounded-lg transition-all">Anuluj</button><button onClick={onConfirm} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg">Przywróć i zapisz</button></div>
      </div>
    </div>
  );
}
