import Icons from '../ui/Icons.jsx';
import { normalizeOrderGender } from '../../utils/orderUtils.js';

export default function RepeatOrderModal({ order, repeatNewDate, setRepeatNewDate, onClose, onConfirm }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl w-full max-w-md shadow-2xl p-6 transform transition-all duration-300">
        <div className="flex items-center gap-3 mb-4 text-indigo-400"><Icons.ArrowRefresh /><h3 className="text-lg font-bold text-white">Powtórz zamówienie</h3></div>
        <p className="text-sm text-slate-300 mb-4">Tworzenie nowego aktywnego zamówienia na bazie wzorca:<br /><strong className="text-white">{order.department} — {order.count} os. ({normalizeOrderGender(order.gender)})</strong></p>
        <div className="space-y-4 mb-6"><div><label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Zdefiniuj nową datę AC *</label><input type="date" required className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" value={repeatNewDate} onChange={(event) => setRepeatNewDate(event.target.value)} /></div></div>
        <div className="flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold rounded-lg uppercase tracking-wider transition-all">Anuluj</button><button onClick={onConfirm} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-lg transition-all">Powtórz zamówienie</button></div>
      </div>
    </div>
  );
}
