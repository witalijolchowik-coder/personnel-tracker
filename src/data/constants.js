export const DEPARTMENTS = ["Metal", "Szwalnia", "Montaż", "Podsofity/PU", "Magazyn"];

export const DEPARTMENT_STYLES = {
            "Metal": "bg-slate-500/10 text-slate-300 border-slate-500/20",
            "Szwalnia": "bg-pink-500/10 text-pink-300 border-pink-500/20",
            "Montaż": "bg-blue-500/10 text-blue-300 border-blue-500/20",
            "Podsofity/PU": "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
            "Magazyn": "bg-amber-500/10 text-amber-300 border-amber-500/20"
        };

export const STAGE_LABELS = {
            'assessment': 'Assessment / Testy (AC)',
            'medical': 'Badania lekarskie',
            'bhp': 'BHP i zatrudnienie',
            'reserve': 'Rezerwa',
            'hired': 'Zatrudnieni',
            'rejected': 'Rezygnacje / Nieobecności'
        };

export const STATUS_OPTIONS_BY_STAGE = {
  assessment: [
    { label: 'W toku (AC)', value: 'Nowy' },
    { label: 'Potwierdzony (➔ Badania)', value: 'Potwierdzony' },
    { label: 'Niepotwierdzony (➔ Odrzuć)', value: 'Niepotwierdzony' },
    { label: 'Nie stawił się (➔ Odrzuć)', value: 'Nie stawił się' },
  ],
  medical: [
    { label: 'Oczekuje', value: 'Oczekuje' },
    { label: 'Przeszedł badania (➔ BHP)', value: 'Przeszedł' },
    { label: 'Nie stawił się (➔ Odrzuć)', value: 'Nie stawił się' },
    { label: 'Rezerwa (Badania nieukończone)', value: 'Do rezerwy (Badania nieukończone)' },
    { label: 'Rezerwa (Badania zaliczone)', value: 'Do rezerwy (Badania zaliczone)' },
  ],
  bhp: [
    { label: 'Oczekuje', value: 'Oczekuje' },
    { label: 'Stawił się na szkolenie', value: 'Stawił się' },
    { label: 'Zatrudniony (➔ Zatrudnieni)', value: 'Zatrudniony' },
    { label: 'Nie stawił się (➔ Odrzuć)', value: 'Nie stawił się' },
  ],
};
