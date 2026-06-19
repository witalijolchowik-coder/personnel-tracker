import Icons from '../ui/Icons.jsx';
import { DEPARTMENTS } from '../../data/constants.js';
import HiredRegistry from './HiredRegistry.jsx';
import RejectedRegistry from './RejectedRegistry.jsx';
import ReserveRegistry from './ReserveRegistry.jsx';

export default function RegistriesSection({ registrySearchQuery, setRegistrySearchQuery, registrySelectedDept, setRegistrySelectedDept, filteredReserveCandidates, filteredHiredCandidates, filteredRejectedCandidates, openDetailsModal, returnToMedicalFromReserve, assignBhpFromReserve, openRestoreModal, handleDeleteCandidate }) {
  return (
    <>
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-slate-800/80" /></div>
        <div className="relative flex justify-center"><span className="bg-slate-950 px-6 text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 border border-slate-800/80 rounded-full py-1"><Icons.Briefcase />Archiwa i Rejestry Systemowe</span></div>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center gap-4 shadow-lg">
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><Icons.Search /></span>
          <input type="text" placeholder="Szukaj w rejestrach po imieniu, nazwisku lub numerze telefonu..." className="block w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" value={registrySearchQuery} onChange={(event) => setRegistrySearchQuery(event.target.value)} />
          {registrySearchQuery && <button onClick={() => setRegistrySearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300">&times;</button>}
        </div>
        <div className="w-full md:w-64 flex items-center gap-2">
          <span className="text-slate-500"><Icons.Filter /></span>
          <select className="block w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" value={registrySelectedDept} onChange={(event) => setRegistrySelectedDept(event.target.value)}>
            <option value="Wszystkie">Wszystkie Działy</option>
            {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-8">
        <ReserveRegistry candidates={filteredReserveCandidates} openDetailsModal={openDetailsModal} returnToMedicalFromReserve={returnToMedicalFromReserve} assignBhpFromReserve={assignBhpFromReserve} handleDeleteCandidate={handleDeleteCandidate} />
        <HiredRegistry candidates={filteredHiredCandidates} openDetailsModal={openDetailsModal} handleDeleteCandidate={handleDeleteCandidate} />
        <RejectedRegistry candidates={filteredRejectedCandidates} openDetailsModal={openDetailsModal} openRestoreModal={openRestoreModal} handleDeleteCandidate={handleDeleteCandidate} />
      </div>
    </>
  );
}
