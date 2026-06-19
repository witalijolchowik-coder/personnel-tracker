import Icons from '../ui/Icons.jsx';
import { DEPARTMENT_STYLES } from '../../data/constants.js';
import { formatDateTime } from '../../utils/dateUtils.js';

export default function ReserveRegistry({ candidates, openDetailsModal, returnToMedicalFromReserve, assignBhpFromReserve, handleDeleteCandidate }) {
  return (
            <section className="bg-slate-900/80 border border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:border-amber-500/30">
                <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                        <h3 className="font-extrabold text-slate-100 tracking-wider text-sm uppercase">Rezerwa kadrowa</h3>
                        <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold px-2.5 py-0.5 rounded-full">
    {candidates.length} kandydatów
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
            <th className="p-4">Kandydat</th>
            <th className="p-4">Dział</th>
            <th className="p-4">Kontakt</th>
            <th className="p-4">Data AC</th>
            <th className="p-4">Data Rez.</th>
            <th className="p-4">Status rezerwy</th>
            <th className="p-4 text-right">Akcje przywrócenia</th>
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
                <td className="p-4 text-slate-300">{formatDateTime(c.displayAssessmentDate, c.displayAssessmentTime)}</td>
                <td className="p-4 text-slate-300">{c.reserveDate || '-'}</td>
                <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${
                        c.status === 'Badania zaliczone' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Badania zaliczone' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                        {c.status}
                    </span>
                </td>
                <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        {c.status === 'Badania nieukończone' ? (
                            <button 
                                onClick={() => returnToMedicalFromReserve(c)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 hover:text-indigo-300 text-slate-200 rounded text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 active:scale-95"
                                title="Przywraca na etap badań lekarskich"
                            >
                                <Icons.ArrowRefresh />
                                Wróć na badania
                            </button>
                        ) : (
                            <button 
                                onClick={() => assignBhpFromReserve(c)}
                                className="px-3 py-1.5 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/20 rounded text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                                title="Przypisuje termin szkolenia BHP i zatrudnienia"
                            >
                                <Icons.ArrowRight />
                                Wyznacz BHP
                            </button>
                        )}
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
