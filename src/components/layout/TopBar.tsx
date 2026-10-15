import { PaletteIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useRole } from '../../contexts/RoleContext';
import { useToast } from '../../contexts/ToastContext';
import { NotificationBell } from './NotificationBell';
import { hiddenRoles, roleLabel, roleUser, roles, type Role } from '../../utils/permissions';
import nylLogo from '../../nyl-logo-1.svg';

export function TopBar(): JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const { role, setRole } = useRole();
  const toast = useToast();

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
        <div className="flex items-center gap-1.5">
          <label htmlFor="view-as-role" className="text-micro font-medium text-muted">View as</label>
          <select
            id="view-as-role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value as Role);
              toast.info(`Viewing as ${roleLabel(e.target.value as Role)}`);
            }}
            className="h-8 rounded-md border border-line bg-white px-2 text-xs font-medium text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
            
            {roles.filter((r) => !hiddenRoles.includes(r.id)).map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'current' ? 'client' : 'current'} theme`}
          className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-xs font-medium text-muted transition-colors duration-150 ease-out hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          <PaletteIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          {theme === 'current' ? 'Current' : 'Client'}
        </button>
        <NotificationBell />
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary-tint text-xs font-semibold text-primary">
            {roleUser[role].split(' ').map((w) => w.charAt(0)).join('').slice(0, 2)}
          </span>
          <div className="text-right">
            <p className="text-[13px] font-semibold leading-4 text-ink">
              {roleUser[role]}
            </p>
            <p className="text-micro uppercase tracking-wide text-muted">
              {roleLabel(role)}
            </p>
          </div>
        </div>
      </div>
    </header>);

}