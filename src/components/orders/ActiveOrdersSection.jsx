import Icons from '../ui/Icons.jsx';
import { normalizeOrderGender } from '../../utils/orderUtils.js';

const ClockIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const formatOrderDate = (date) => {
    if (!date) return 'Nie ustalono';
    const [year, month, day] = String(date).split('-');
    return year && month && day ? `${day}.${month}.${year}` : date;
};

const OrderAssessmentSchedule = ({ order, muted = false }) => (
    <div className="mt-1.5">
        <div className={`text-[9px] font-extrabold uppercase tracking-wider ${muted ? 'text-slate-600' : 'text-slate-400'}`}>
            Assessment / Testy (AC)
        </div>
        <div className="mt-1.5 grid grid-cols-1 min-[360px]:grid-cols-2 gap-1.5">
            <div className={`rounded-md border px-2 py-1.5 min-h-[48px] ${muted ? 'border-slate-800 bg-slate-950/70 text-slate-500' : 'border-blue-500/25 bg-blue-950/35 text-blue-100'}`}>
                <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider opacity-80 [&_svg]:w-3.5 [&_svg]:h-3.5">
                    <Icons.Calendar />
                    <span>DATA</span>
                </div>
                <div className="mt-0.5 text-[12px] font-extrabold leading-tight">{formatOrderDate(order.assessmentDate)}</div>
            </div>
            <div className={`rounded-md border px-2 py-1.5 min-h-[48px] ${muted ? 'border-slate-800 bg-slate-950/70 text-slate-500' : 'border-violet-500/25 bg-violet-950/35 text-violet-100'}`}>
                <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider opacity-80">
                    <ClockIcon />
                    <span>GODZINA</span>
                </div>
                <div className={`mt-0.5 font-extrabold leading-tight ${order.assessmentTime ? 'text-[12px]' : 'text-[10px]'}`}>
                    {order.assessmentTime || 'Nie ustalono'}
                </div>
            </div>
        </div>
    </div>
);

export default function ActiveOrdersSection({ inactiveOrders, activeOrders, getOrderRealization, openEditOrderModal, openAddOrderModal, handleRepeatOrder, triggerDeleteOrder, onClearArchive }) {
  return (
    <section className="w-full">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Aktywne zapotrzebowanie
                </h2>
            </div>
            <div className="flex items-center gap-3">
                {inactiveOrders.length > 0 && (
                    <button 
                        onClick={() => onClearArchive()}
                        className="text-[10px] font-extrabold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-wider"
                    >
                        Oczyść archiwum
                    </button>
                )}
                <button 
                    onClick={openAddOrderModal}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 text-indigo-400 hover:text-indigo-300 border border-slate-800 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 active:scale-95"
                >
                    <Icons.UserAdd />
                    <span>Dodaj zamówienie</span>
                </button>
            </div>
        </div>
    
        {/* JEDNORZĘDOWY GŁADKI UKŁAD KART */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {/* AKTYWNE ZAMÓWIENIA */}
            {activeOrders.map(order => {
                const currentCount = getOrderRealization(order);
                return (
                    <div 
                        key={order.id}
                        onClick={() => openEditOrderModal(order)}
                        className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 p-3 rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-indigo-950/10 flex flex-col justify-between min-h-[154px] group relative"
                    >
                        <div>
                        <div className="flex justify-between items-start">
    <div>
        <h4 className="font-extrabold text-sm text-white uppercase tracking-wider group-hover:text-indigo-400 transition-colors">
            {order.department}
        </h4>
    </div>
    <span className="text-[9px] bg-slate-950 text-indigo-300 px-2 py-0.5 rounded border border-slate-850 font-semibold">
        {normalizeOrderGender(order.gender)}
    </span>
                        </div>
                        <OrderAssessmentSchedule order={order} />
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-850 pt-1.5 mt-1.5">
    <div className="flex flex-col">
        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Zamówiono</span>
        <span className="text-xs text-slate-200 font-bold">{order.count} os.</span>
    </div>
    <span className={`text-[10px] font-black px-2 py-1 rounded ${currentCount >= order.count ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-950/80 text-indigo-400 border border-indigo-500/20'}`}>
        Realizacja: {currentCount} / {order.count}
    </span>
                        </div>
                    </div>
                );
            })}
    
            {/* MAKSYMALNIE 2 OSTATNIE NIEAKTYWNE ZAMÓWIENIA */}
            {inactiveOrders.map(order => {
                return (
                    <div 
                        key={order.id}
                        className="bg-slate-950/40 border border-slate-900 border-dashed p-3 rounded-xl transition-all duration-300 shadow-md flex flex-col justify-between min-h-[154px] opacity-40 hover:opacity-90 group relative"
                    >
                        <div>
                        <div className="flex justify-between items-start">
    <div>
        <h4 className="font-extrabold text-sm text-slate-500 uppercase tracking-wider">
            {order.department}
        </h4>
    </div>
    <span className="text-[9px] bg-slate-950 text-slate-600 px-2 py-0.5 rounded border border-slate-900 font-semibold">
        {normalizeOrderGender(order.gender)}
    </span>
                        </div>
                        <OrderAssessmentSchedule order={order} muted />
                        </div>
                        
                        <div className="flex gap-1.5 border-t border-slate-900 pt-1.5 mt-1.5">
    <button 
        onClick={(e) => { e.stopPropagation(); handleRepeatOrder(order); }}
        className="flex-1 py-1 bg-slate-900 hover:bg-indigo-950/80 text-indigo-400 hover:text-indigo-300 rounded-md text-[10px] font-bold transition-all border border-slate-850"
    >
        Powtórz
    </button>
    <button 
        onClick={(e) => { e.stopPropagation(); triggerDeleteOrder(order.id); }}
        className="px-2 py-1 bg-slate-900 hover:bg-rose-950/80 text-rose-400 hover:text-rose-300 rounded-md text-[10px] font-bold transition-all border border-slate-850"
    >
        Usuń
    </button>
                        </div>
                    </div>
                );
            })}
    
            {activeOrders.length === 0 && inactiveOrders.length === 0 && (
                <div className="col-span-full py-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                    Brak zapotrzebowań. Dodaj zamówienie powyżej, aby zaplanować strukturę.
                </div>
            )}
        </div>
    </section>
  );
}
