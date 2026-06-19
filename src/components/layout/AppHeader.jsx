import Icons from '../ui/Icons.jsx';

export default function AppHeader({ currentUser, onLogout }) {
  return (
    <header className="bg-slate-900 border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-lg shadow-lg shadow-indigo-500/20"><Icons.Sparkles /></div>
          <h1 className="text-lg font-extrabold tracking-tight text-white">Personnel Tracker</h1>
        </div>
        {currentUser && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-400">{currentUser.email}</span>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
            >
              Wyloguj
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
