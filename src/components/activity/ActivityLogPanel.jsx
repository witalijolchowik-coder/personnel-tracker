import { useEffect, useState } from 'react';
import Icons from '../ui/Icons.jsx';
import { formatActivityTime, getActivityLogDisplayModel } from '../../utils/activityLogUtils.js';

export default function ActivityLogPanel({ entries, loading, error, onClear }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <aside className="w-full xl:w-[230px] 2xl:w-[240px] xl:flex-none">
      <section className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-indigo-500 flex-none" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 leading-tight">DZIENNIK ZDARZEŃ</h2>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded transition-all flex-none"
            title="Wyczyść dziennik zdarzeń"
          >
            <Icons.Trash />
          </button>
        </div>

        <div>
          {loading && (
            <div className="p-4 text-xs text-slate-400">Ładowanie dziennika zdarzeń...</div>
          )}

          {!loading && error && (
            <div className="p-4 text-xs text-rose-200 bg-rose-950/30 border-b border-rose-500/20">{error}</div>
          )}

          {!loading && !error && entries.length === 0 && (
            <div className="p-4 text-xs text-slate-500">Brak zdarzeń do wyświetlenia.</div>
          )}

          {!loading && !error && entries.map((entry) => {
            const display = getActivityLogDisplayModel(entry);
            const descriptionLines = display.description.split('\n').filter(Boolean);

            return (
              <article key={entry.id} className="px-4 py-3 border-b border-slate-700/70 last:border-b-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span aria-hidden="true" className="text-sm leading-none">{display.marker}</span>
                  <span className="font-bold text-slate-100">{display.userName}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{formatActivityTime(entry.createdAt, now)}</span>
                </div>
                <div className="mt-2 text-xs leading-relaxed">
                  <div className="font-semibold text-slate-200">{descriptionLines[0]}</div>
                  {descriptionLines.slice(1).map(line => (
                    <div key={line} className="text-slate-400">{line}</div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
