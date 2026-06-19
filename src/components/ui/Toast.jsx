import Icons from './Icons.jsx';

export default function Toast({ alert }) {
  if (!alert.show) return null;
  return (
    <div className={`fixed top-4 right-4 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-2xl border transition-all duration-300 transform translate-y-0 ${
      alert.type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
        : alert.type === 'error' ? 'bg-rose-950/90 border-rose-500 text-rose-200'
          : 'bg-indigo-950/90 border-indigo-500 text-indigo-200'
    }`}>
      {alert.type === 'success' && <Icons.Check />}
      {alert.type === 'error' && <Icons.XCircle />}
      {alert.type === 'info' && <Icons.Info />}
      <span className="font-medium text-sm">{alert.message}</span>
    </div>
  );
}
