import Icons from '../ui/Icons.jsx';
import { DEPARTMENTS } from '../../data/constants.js';
import { ORDER_GENDERS } from '../../utils/orderUtils.js';

export default function OrderModal({ isOpen, editingOrder, saveOrder, orderDept, setOrderDept, orderCount, setOrderCount, orderGender, setOrderGender, orderACDate, setOrderACDate, triggerDeleteOrder, onClose }) {
  if (!isOpen) return null;
  return (
        <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all duration-300">
                <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Icons.ShoppingBag />
                        {editingOrder ? "Modyfikacja zamówienia" : "Zdefiniuj nowe zamówienie"}
                    </h3>
                    <button 
                        onClick={() => onClose()} 
                        className="text-slate-400 hover:text-white transition-colors text-xl font-semibold p-1"
                    >
                        &times;
                    </button>
                </div>
    
                <form onSubmit={saveOrder} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Dział *</label>
                        <select 
    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
    value={orderDept}
    onChange={(e) => setOrderDept(e.target.value)}
                        >
    {DEPARTMENTS.map(dept => (
        <option key={dept} value={dept}>{dept}</option>
    ))}
                        </select>
                    </div>
    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Liczba osób *</label>
    <input 
        type="number" 
        min="1"
        required
        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
        value={orderCount}
        onChange={(e) => setOrderCount(e.target.value)}
    />
                        </div>
                        <div>
    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Preferowana płeć</label>
    <select 
        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
        value={orderGender}
        onChange={(e) => setOrderGender(e.target.value)}
    >
        {ORDER_GENDERS.map(gender => (
            <option key={gender} value={gender}>{gender}</option>
        ))}
    </select>
                        </div>
                    </div>
    
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Data AC *</label>
                        <input 
    type="date" 
    required
    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
    value={orderACDate}
    onChange={(e) => setOrderACDate(e.target.value)}
                        />
                    </div>
    
                    <div className="pt-4 border-t border-slate-850 flex items-center justify-between gap-3">
                        <div>
    {editingOrder && (
        <button 
            type="button"
            onClick={() => triggerDeleteOrder(editingOrder.id)}
            className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-lg transition-all"
        >
            Usuń zamówienie
        </button>
    )}
                        </div>
                        <div className="flex gap-2">
    <button 
        type="button"
        onClick={() => onClose()}
        className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold rounded-lg transition-all"
    >
        Anuluj
    </button>
    <button 
        type="submit"
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all"
    >
        Zapisz
    </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
  );
}
