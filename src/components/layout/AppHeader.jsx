import Icons from '../ui/Icons.jsx';
import logoUrl from '../../assets/personnel-logo.png';

export default function AppHeader({ currentUser, onLogout }) {
  return (
    <header className="sticky top-0 z-50 px-7 pt-6">
      <div className="h-[104px] rounded-[28px] overflow-hidden border border-white/[0.08] bg-[linear-gradient(90deg,#14112d_0%,#17265a_52%,#1f5cff_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.35)] flex items-center justify-between pl-6 sm:pl-8 pr-4 sm:pr-6">
        <div className="flex items-center min-w-0 gap-5">
          <img
            src={logoUrl}
            alt="Personnel Tracker"
            className="h-14 sm:h-16 w-auto flex-none object-contain"
          />
          <h1 className="font-['Inter','Segoe_UI',sans-serif] text-[26px] sm:text-[42px] lg:text-[56px] leading-none font-bold tracking-[-0.02em] text-white truncate">
            Personnel Tracker
          </h1>
        </div>
        {currentUser && (
          <div className="flex items-center flex-none">
            <span className="hidden md:inline font-['Inter','Segoe_UI',sans-serif] text-base lg:text-[17px] font-medium text-white/80">
              {currentUser.email}
            </span>
            <span className="hidden md:block h-10 w-px bg-white/[0.18] mx-6" aria-hidden="true" />
            <button
              onClick={onLogout}
              className="h-12 px-4 sm:px-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.18] hover:border-white/30 text-white font-['Inter','Segoe_UI',sans-serif] text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2"
            >
              <Icons.Logout />
              <span>WYLOGUJ</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
