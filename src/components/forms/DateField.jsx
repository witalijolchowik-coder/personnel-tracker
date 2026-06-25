import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icons from '../ui/Icons.jsx';
import { formatDateForInput, parseFlexibleDate } from '../../utils/dateInputUtils.js';

const MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];
const WEEKDAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

const dateFromValue = value => {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date();
};

export default function DateField({
  value,
  onChange,
  required = false,
  placeholder = 'DD.MM.RRRR',
  className = '',
  minYear = 1920,
  maxYear = new Date().getFullYear() + 10,
}) {
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const [draft, setDraft] = useState(() => formatDateForInput(value));
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => dateFromValue(value));
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setDraft(formatDateForInput(value));
    if (value) setVisibleMonth(dateFromValue(value));
  }, [value]);

  useEffect(() => {
    inputRef.current?.setCustomValidity(error ? 'Nieprawidłowa data' : '');
  }, [error]);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutside = event => {
      if (!wrapperRef.current?.contains(event.target) && !panelRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnViewportChange = () => setOpen(false);
    document.addEventListener('mousedown', closeOnOutside);
    window.addEventListener('resize', closeOnViewportChange);
    window.addEventListener('scroll', closeOnViewportChange, true);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      window.removeEventListener('resize', closeOnViewportChange);
      window.removeEventListener('scroll', closeOnViewportChange, true);
    };
  }, [open]);

  const years = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, index) => maxYear - index),
    [minYear, maxYear]
  );

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return [
      ...Array.from({ length: mondayOffset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [visibleMonth]);

  const commitDraft = (text, showError = true) => {
    const parsed = parseFlexibleDate(text);
    if (parsed === null) {
      onChange('');
      inputRef.current?.setCustomValidity('Nieprawidłowa data');
      if (showError) setError('Nieprawidłowa data. Użyj np. 25.06.2026.');
      return false;
    }
    inputRef.current?.setCustomValidity('');
    setError('');
    onChange(parsed);
    setDraft(formatDateForInput(parsed));
    return true;
  };

  const handleTextChange = event => {
    const text = event.target.value;
    setDraft(text);
    setError('');
    const parsed = parseFlexibleDate(text);
    inputRef.current?.setCustomValidity(parsed === null ? 'Nieprawidłowa data' : '');
    onChange(parsed === null ? '' : parsed);
  };

  const openCalendar = () => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) {
      const width = Math.min(304, window.innerWidth - 24);
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
      const preferredTop = rect.bottom + 6;
      const top = preferredTop + 330 > window.innerHeight ? Math.max(12, rect.top - 330) : preferredTop;
      setPanelPosition({ top, left, width });
    }
    setVisibleMonth(dateFromValue(value));
    setOpen(current => !current);
  };

  const selectDay = day => {
    const selected = `${visibleMonth.getFullYear()}-${String(visibleMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(selected);
    setDraft(formatDateForInput(selected));
    inputRef.current?.setCustomValidity('');
    setError('');
    setOpen(false);
  };

  const selectedKey = value || '';

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className={`flex items-center rounded-lg border bg-slate-950 transition-colors ${error ? 'border-rose-500' : 'border-slate-800 focus-within:border-indigo-500'}`}>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          required={required}
          value={draft}
          placeholder={placeholder}
          onChange={handleTextChange}
          onBlur={() => commitDraft(draft)}
          onPaste={event => {
            event.preventDefault();
            const text = (
              event.clipboardData.getData('text/plain')
              || event.clipboardData.getData('text')
            ).trim();
            setDraft(text);
            commitDraft(text);
          }}
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none"
        />
        <button
          type="button"
          onClick={openCalendar}
          className="h-9 w-10 flex items-center justify-center border-l border-slate-700 bg-slate-900/60 text-sky-300 transition-colors hover:bg-slate-800/80 hover:text-sky-200 [&_svg]:stroke-current"
          title="Otwórz kalendarz"
        >
          <Icons.Calendar />
        </button>
      </div>
      {error && <div className="mt-1 text-[10px] text-rose-300">{error}</div>}

      {open && createPortal(
        <div
          ref={panelRef}
          style={{ position: 'fixed', ...panelPosition }}
          className="z-[300] rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-2xl shadow-black/50"
        >
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
              className="w-8 h-8 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500"
            >
              ‹
            </button>
            <select
              value={visibleMonth.getMonth()}
              onChange={event => setVisibleMonth(new Date(visibleMonth.getFullYear(), Number(event.target.value), 1))}
              className="min-w-0 flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
            >
              {MONTHS.map((month, index) => <option key={month} value={index}>{month}</option>)}
            </select>
            <select
              value={visibleMonth.getFullYear()}
              onChange={event => setVisibleMonth(new Date(Number(event.target.value), visibleMonth.getMonth(), 1))}
              className="w-[78px] bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
            >
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
            <button
              type="button"
              onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
              className="w-8 h-8 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map(day => <div key={day} className="py-1 text-[9px] font-bold text-slate-500">{day}</div>)}
            {calendarDays.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} />;
              const key = `${visibleMonth.getFullYear()}-${String(visibleMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = key === selectedKey;
              const isToday = (
                day === new Date().getDate()
                && visibleMonth.getMonth() === new Date().getMonth()
                && visibleMonth.getFullYear() === new Date().getFullYear()
              );
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => selectDay(day)}
                  className={`h-8 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : isToday
                        ? 'border border-indigo-500/50 text-indigo-300 hover:bg-indigo-950'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              const today = new Date();
              const selected = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
              onChange(selected);
              setDraft(formatDateForInput(selected));
              inputRef.current?.setCustomValidity('');
              setError('');
              setVisibleMonth(today);
              setOpen(false);
            }}
            className="mt-3 w-full py-1.5 rounded-lg bg-indigo-600/15 border border-indigo-500/25 text-indigo-300 text-xs font-bold hover:bg-indigo-600/25"
          >
            Dzisiaj
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
