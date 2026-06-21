import Icons from '../ui/Icons.jsx';
import logoUrl from '../../assets/personnel-logo.png';

export default function AppHeader({ currentUser, onLogout }) {
  return (
    <header className="px-7 pt-6">
      <div className="h-[100px] rounded-[28px] overflow-hidden border border-white/[0.08] bg-[linear-gradient(90deg,#120f2a_0%,#17265a_54%,#1f5cff_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.35)] flex items-center justify-between pl-8 pr-4 sm:pr-6">
        <div className="flex items-center min-w-0 gap-6">
          <img
            src={logoUrl}
            alt="Personnel Tracker"
            className="h-[58px] sm:h-[62px] w-auto flex-none object-contain"
          />
          <h1 className="font-['Inter','Segoe_UI',sans-serif] text-[26px] sm:text-[34px] lg:text-[36px] leading-none font-bold tracking-[-0.02em] text-white truncate">
            Personnel Tracker
          </h1>
        </div>
        {currentUser && (
          <div className="flex items-center flex-none">
            <span className="hidden md:inline font-['Inter','Segoe_UI',sans-serif] text-[15px] lg:text-base font-medium text-white/80">
              {currentUser.email}
            </span>
            <span className="hidden md:block h-9 w-px bg-white/[0.18] mx-6" aria-hidden="true" />
            <button
              onClick={onLogout}
              className="h-11 px-4 sm:px-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.18] hover:border-white/30 text-white font-['Inter','Segoe_UI',sans-serif] text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2"
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
