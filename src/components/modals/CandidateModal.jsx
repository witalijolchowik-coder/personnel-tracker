import Icons from '../ui/Icons.jsx';
import { DEPARTMENTS } from '../../data/constants.js';
import { formatCandidateDisplayName } from '../../utils/candidateDisplayUtils.js';
import { formatDateTime } from '../../utils/dateUtils.js';

export default function CandidateModal({ isOpen, editingCandidate, handleSubmitForm, activeOrders, selectedOrderSelection, setSelectedOrderSelection, getOrderRealization, formFirstName, setFormFirstName, formLastName, setFormLastName, formBirthDate, setFormBirthDate, formPhone, setFormPhone, formAssessmentDate, setFormAssessmentDate, formAssessmentTime, setFormAssessmentTime, formDepartment, setFormDepartment, onClose }) {
  if (!isOpen) return null;
  const editingCandidateName = editingCandidate ? formatCandidateDisplayName(editingCandidate) : '';
  return (
        <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all duration-300">
                <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Icons.UserAdd />
                        {editingCandidate ? `Edytuj kandydata: ${editingCandidateName}` : "Dodaj nowego kandydata"}
                    </h3>
                    <button 
                        onClick={() => onClose()} 
                        className="text-slate-400 hover:text-white transition-colors text-xl font-semibold p-1"
                    >
                        &times;
                    </button>
                </div>
                
                <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Imię *</label>
    <input 
        type="text" 
        required
        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
        value={formFirstName}
        onChange={(e) => setFormFirstName(e.target.value)}
    />
                        </div>
                        <div>
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nazwisko *</label>
    <input 
        type="text" 
        required
        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
        value={formLastName}
        onChange={(e) => setFormLastName(e.target.value)}
    />
                        </div>
                    </div>
    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Data urodzenia</label>
    <input 
        type="date" 
        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
        value={formBirthDate}
        onChange={(e) => setFormBirthDate(e.target.value)}
    />
                        </div>
                        <div>
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Telefon *</label>
    <input 
        type="tel" 
        required
        placeholder="np. 601202303"
        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
        value={formPhone}
        onChange={(e) => setFormPhone(e.target.value)}
    />
                        </div>
                    </div>
    
                    {/* Sekcja szybkiego wyboru Aktywnego AC / zamówienia */}
                    <div className="pt-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Wybierz aktywne AC</label>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {activeOrders.map(order => {
        const isSelected = selectedOrderSelection === order.id;
        const currentCount = getOrderRealization(order);
        return (
            <div 
                key={order.id}
                onClick={() => {
                    setSelectedOrderSelection(order.id);
                    setFormDepartment(order.department);
                    setFormAssessmentDate('');
                    setFormAssessmentTime('');
                }}
                className={`p-2 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-[68px] ${
                    isSelected 
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-950/20' 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
            >
                <div>
                    <div className="font-extrabold text-[10px] text-white uppercase truncate">{order.department}</div>
                    <div className="text-[8px] text-slate-400 mt-0.5">AC: {formatDateTime(order.assessmentDate, order.assessmentTime)}</div>
                </div>
                <div className="text-[9px] font-black text-indigo-400 border-t border-slate-850 pt-0.5 mt-1">
                    {currentCount} / {order.count} os.
                </div>
            </div>
        );
    })}
    
    {/* Przycisk wprowadzania ręcznego */}
    <div 
        onClick={() => {
            setSelectedOrderSelection("manual");
        }}
        className={`p-2 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-center h-[68px] ${
            selectedOrderSelection === "manual" 
            ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-950/20' 
            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
        }`}
    >
        <div className="font-extrabold text-[10px] text-white uppercase tracking-wider">Wprowadź ręcznie</div>
        <div className="text-[8px] text-slate-500 mt-0.5 leading-tight">Własny dział, data i godzina</div>
    </div>
                        </div>
                    </div>
    
                    {/* Renderowanie pól wyboru działu i daty AC wyłącznie po zaznaczeniu opcji "Wprowadź ręcznie" */}
                    {selectedOrderSelection === "manual" && (
                        <div className="grid grid-cols-2 gap-4 pt-1 transition-all duration-300">
    <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Data AC</label>
        <input 
            type="date" 
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
            value={formAssessmentDate}
            onChange={(e) => setFormAssessmentDate(e.target.value)}
        />
    </div>
    <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dział *</label>
        <select 
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            value={formDepartment}
            onChange={(e) => setFormDepartment(e.target.value)}
        >
            {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
            ))}
        </select>
    </div>
    <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Godzina AC</label>
        <input
            type="time"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
            value={formAssessmentTime}
            onChange={(e) => setFormAssessmentTime(e.target.value)}
        />
    </div>
                        </div>
                    )}
    
                    <div className="pt-4 border-t border-slate-850 flex items-center justify-end gap-3">
                        <button 
    type="button"
    onClick={() => onClose()}
    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-lg transition-all"
                        >
    Anuluj
                        </button>
                        <button 
    type="submit"
    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg rounded-lg transition-all"
                        >
    Zapisz kandydata
                        </button>
                    </div>
                </form>
            </div>
        </div>
  );
}
