import Icons from '../ui/Icons.jsx';

export default function BhpDateModal({ candidate, bhpDate, setBhpDate, bhpTime, setBhpTime, source, onConfirm, onSendToReserve, onClose }) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800/85 rounded-xl w-full max-w-md shadow-2xl p-6 transform transition-all duration-300">
        <div className="flex items-center gap-3 mb-4 text-indigo-400">
          <Icons.Calendar />
          <h3 className="text-lg font-bold text-white">Wyznacz datę BHP</h3>
        </div>
        <p className="text-sm text-slate-300 mb-4">
          Kandydat <strong className="text-white">{candidate.firstName} {candidate.lastName}</strong>
          {' '}zostanie skierowany na etap BHP i zatrudnienie.
        </p>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Data BHP *</label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              value={bhpDate}
              onChange={(event) => setBhpDate(event.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Godzina BHP</label>
            <input
              type="time"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              value={bhpTime}
              onChange={(event) => setBhpTime(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold rounded-lg transition-all"
          >
            Anuluj
          </button>
          {source === 'medical' && (
            <button
              onClick={onSendToReserve}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 text-xs font-bold rounded-lg transition-all"
            >
              Wyślij do rezerwy
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg"
          >
            Wyznacz BHP
          </button>
        </div>
      </div>
    </div>
  );
}
