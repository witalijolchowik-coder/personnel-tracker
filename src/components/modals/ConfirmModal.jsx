import Icons from '../ui/Icons.jsx';

const toneMap = {
  rose: { icon: 'text-rose-500', button: 'bg-rose-600 hover:bg-rose-500' },
  amber: { icon: 'text-amber-500', button: 'bg-amber-600 hover:bg-amber-500' },
};

export default function ConfirmModal({ isOpen, tone = 'rose', title, children, confirmLabel, onConfirm, onCancel }) {
  if (!isOpen) return null;
  const styles = toneMap[tone] || toneMap.rose;
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800/85 rounded-xl w-full max-w-md shadow-2xl p-6 transform transition-all duration-300">
        <div className={`flex items-center gap-3 mb-4 ${styles.icon}`}><Icons.AlertCircle /><h3 className="text-lg font-bold text-white">{title}</h3></div>
        <div className="text-sm text-slate-300 mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold rounded-lg transition-all">Anuluj</button>
          <button onClick={onConfirm} className={`px-5 py-2 ${styles.button} text-white text-xs font-bold rounded-lg transition-all shadow-lg`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
