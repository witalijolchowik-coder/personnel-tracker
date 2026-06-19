import Icons from '../ui/Icons.jsx';
import { DEPARTMENT_STYLES } from '../../data/constants.js';

export default function HiredRegistry({ candidates, openDetailsModal, handleDeleteCandidate }) {
  return (
            <section className="bg-slate-900/80 border border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30">
                <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <h3 className="font-extrabold text-slate-100 tracking-wider text-sm uppercase">Rejestr osób zatrudnionych</h3>
                        <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-full">
    {candidates.length} zatrudnionych
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {candidates.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">Brak wyników spełniających kryteria.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
    <thead>
        <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs uppercase font-semibold">
            <th className="p-4">Pracownik</th>
            <th className="p-4">Dział</th>
            <th className="p-4">Kontakt</th>
            <th className="p-4">Data AC</th>
            <th className="p-4">Data Badania</th>
            <th className="p-4">Data BHP</th>
            <th className="p-4">Zatrudniono</th>
            <th className="p-4 text-right">Opcje</th>
        </tr>
    </thead>
    <tbody className="divide-y divide-slate-800/40 text-sm">
        {candidates.map(c => (
            <tr key={c.id} className="hover:bg-slate-850/30 transition-colors">
                <td className="p-4">
                    <button onClick={() => openDetailsModal(c)} className="font-bold text-slate-100 hover:text-indigo-400 text-left transition-colors">
                        {c.firstName} {c.lastName}
                    </button>
                </td>
                <td className="p-4">
                    <span className={`px-2 py-0.5 text-xs rounded border ${DEPARTMENT_STYLES[c.department] || ''}`}>
                        {c.department}
                    </span>
                </td>
                <td className="p-4 text-slate-300">{c.phone}</td>
                <td className="p-4 text-slate-300">{c.assessmentDate || '-'}</td>
                <td className="p-4 text-slate-300">{c.medicalDate || '-'}</td>
                <td className="p-4 text-slate-300">{c.bhpDate || '-'}</td>
                <td className="p-4 font-bold text-emerald-400">{c.hireDate || '-'}</td>
                <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button 
                            onClick={() => openDetailsModal(c)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded border border-slate-700 transition-all text-xs flex items-center gap-1 px-2.5"
                        >
                            <Icons.History />
                            Karta
                        </button>
                        <button 
                            onClick={(e) => handleDeleteCandidate(c.id, e)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 rounded border border-slate-700 hover:border-rose-900 transition-all"
                            title="Usuń"
                        >
                            <Icons.Trash />
                        </button>
                    </div>
                </td>
            </tr>
        ))}
    </tbody>
                        </table>
                    )}
                </div>
            </section>
  );
}
