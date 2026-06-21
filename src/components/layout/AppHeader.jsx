import Icons from '../ui/Icons.jsx';
import logoUrl from '../../assets/personnel-logo.png';

export default function AppHeader({ currentUser, onLogout }) {
  return (
    <header className="px-7 pt-6">
      <div className="h-[82px] rounded-[28px] overflow-hidden border border-white/[0.06] bg-[linear-gradient(90deg,#111027_0%,#172557_58%,#1f5cff_100%)] shadow-[0_8px_24px_rgba(0,0,0,0.30)] flex items-center justify-between pl-8 pr-4 sm:pr-5">
        <div className="flex items-center min-w-0 gap-5">
          <img
            src={logoUrl}
            alt="Personnel Tracker"
            className="h-[46px] sm:h-[50px] w-auto flex-none object-contain"
          />
          <h1 className="font-['Inter','Segoe_UI',sans-serif] text-[24px] sm:text-[30px] lg:text-[32px] leading-none font-bold tracking-[-0.02em] text-white truncate">
            Personnel Tracker
          </h1>
        </div>
        {currentUser && (
          <div className="flex items-center flex-none">
            <span className="hidden md:inline font-['Inter','Segoe_UI',sans-serif] text-[15px] font-medium text-white/80">
              {currentUser.email}
            </span>
            <span className="hidden md:block h-[34px] w-px bg-white/[0.16] mx-5" aria-hidden="true" />
            <button
              onClick={onLogout}
              className="h-10 px-4 sm:px-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.16] hover:border-white/28 text-white font-['Inter','Segoe_UI',sans-serif] text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2"
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
