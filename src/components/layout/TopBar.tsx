import { BellIcon, PaletteIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import nylLogo from '../../nyl-logo-1.svg';

export function TopBar(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-white px-6">
      <div className="flex items-center gap-3">
        <img src={nylLogo} alt="NYL Logo" className="h-8 w-8 rounded" />
        <div>
          <p className="text-sm font-semibold leading-4 text-ink">
            NYL Institutional Life
          </p>
          <p className="text-micro text-muted">AutoQuote Pricing Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'current' ? 'client' : 'current'} theme`}
          className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-xs font-medium text-muted transition-colors duration-150 ease-out hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          <PaletteIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          {theme === 'current' ? 'Current' : 'Client'}
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted transition-colors duration-150 ease-out hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          
          <BellIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white tnum">
            4
          </span>
        </button>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary-tint text-xs font-semibold text-primary">
            KY
          </span>
          <div className="text-right">
            <p className="text-[13px] font-semibold leading-4 text-ink">
              Kiran Yeligeti
            </p>
            <p className="text-micro uppercase tracking-wide text-muted">
              Admin
            </p>
          </div>
        </div>
      </div>
    </header>);

}