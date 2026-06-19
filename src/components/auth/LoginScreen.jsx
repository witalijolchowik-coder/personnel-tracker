import { useState } from 'react';
import Icons from '../ui/Icons.jsx';

export default function LoginScreen({ authError, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    try {
      await onLogin(email, password);
    } catch (error) {
      setFormError(error.message || 'Nie udało się zalogować.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800/80 rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-lg shadow-lg shadow-indigo-500/20"><Icons.Sparkles /></div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white">Personnel Tracker</h1>
            <p className="text-xs text-slate-400">Logowanie do systemu</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Hasło</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          {(formError || authError) && (
            <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-500/20 rounded-lg p-3">
              {formError || authError}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all shadow-lg"
          >
            {isSubmitting ? 'Logowanie...' : 'Zaloguj'}
          </button>
        </form>
      </div>
    </div>
  );
}
