import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { parseFlexibleTime } from '../../utils/dateInputUtils.js';

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function TimeField({
  value,
  onChange,
  required = false,
  placeholder = 'GG:MM',
  className = '',
}) {
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const [draft, setDraft] = useState(value || '');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [pickerHour, setPickerHour] = useState('08');
  const [pickerMinute, setPickerMinute] = useState('00');
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });

  useEffect(() => setDraft(value || ''), [value]);

  useEffect(() => {
    inputRef.current?.setCustomValidity(error ? 'Nieprawidłowa godzina' : '');
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

  const commitDraft = (text, showError = true) => {
    const parsed = parseFlexibleTime(text);
    if (parsed === null) {
      onChange('');
      inputRef.current?.setCustomValidity('Nieprawidłowa godzina');
      if (showError) setError('Nieprawidłowa godzina. Użyj np. 08:30.');
      return false;
    }
    inputRef.current?.setCustomValidity('');
    setError('');
    onChange(parsed);
    setDraft(parsed);
    return true;
  };

  const handleTextChange = event => {
    const text = event.target.value;
    setDraft(text);
    setError('');
    const parsed = parseFlexibleTime(text);
    inputRef.current?.setCustomValidity(parsed === null ? 'Nieprawidłowa godzina' : '');
    onChange(parsed === null ? '' : parsed);
  };

  const openPicker = () => {
    const parsed = parseFlexibleTime(value) || '08:00';
    setPickerHour(parsed.slice(0, 2));
    setPickerMinute(parsed.slice(3));
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) {
      const width = Math.min(250, window.innerWidth - 24);
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
      const preferredTop = rect.bottom + 6;
      const top = preferredTop + 150 > window.innerHeight ? Math.max(12, rect.top - 150) : preferredTop;
      setPanelPosition({ top, left, width });
    }
    setOpen(current => !current);
  };

  const applyPicker = () => {
    const nextValue = `${pickerHour}:${pickerMinute}`;
    setDraft(nextValue);
    inputRef.current?.setCustomValidity('');
    setError('');
    onChange(nextValue);
    setOpen(false);
  };

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
            const text = event.clipboardData.getData('text');
            setDraft(text);
            commitDraft(text);
          }}
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none"
        />
        <button
          type="button"
          onClick={openPicker}
          className="h-9 w-10 flex items-center justify-center text-slate-400 hover:text-indigo-300 border-l border-slate-800 transition-colors"
          title="Wybierz godzinę"
        >
          <ClockIcon />
        </button>
      </div>
      {error && <div className="mt-1 text-[10px] text-rose-300">{error}</div>}

      {open && createPortal(
        <div
          ref={panelRef}
          style={{ position: 'fixed', ...panelPosition }}
          className="z-[300] rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-2xl shadow-black/50"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <select
              value={pickerHour}
              onChange={event => setPickerHour(event.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-sm text-white"
            >
              {Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0')).map(hour => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
            <span className="text-slate-400 font-bold">:</span>
            <select
              value={pickerMinute}
              onChange={event => setPickerMinute(event.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-sm text-white"
            >
              {Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, '0')).map(minute => (
                <option key={minute} value={minute}>{minute}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1">
            {['00', '15', '30', '45'].map(minute => (
              <button
                type="button"
                key={minute}
                onClick={() => setPickerMinute(minute)}
                className={`py-1.5 rounded-lg border text-[10px] font-bold ${
                  pickerMinute === minute
                    ? 'bg-indigo-600/25 border-indigo-500 text-indigo-200'
                    : 'border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                :{minute}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={applyPicker}
            className="mt-3 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
          >
            Ustaw godzinę
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
