import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon } from 'lucide-react';
import { useCaseStore } from '../../contexts/CaseStore';
import { useRole } from '../../contexts/RoleContext';
import { isOpen, pendingDays, pendingText, primaryActionFor, stageLabel } from '../../utils/approvalFlow';
import { roleLabel } from '../../utils/permissions';

export function NotificationBell(): JSX.Element {
  const { cases } = useCaseStore();
  const { role } = useRole();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const waiting = useMemo(
    () => cases.filter((c) => isOpen(c) && c.approvalStage !== 'Approved' && primaryActionFor(role, c.approvalStage)),
    [cases, role]
  );

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={waiting.length ? `Notifications, ${waiting.length} pending` : 'Notifications'}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted transition-colors duration-150 ease-out hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        
        <BellIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        {waiting.length > 0 &&
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white tnum">
            {waiting.length}
          </span>
        }
      </button>

      {open &&
      <div className="absolute right-0 z-40 mt-2 w-[340px] rounded-card border border-line bg-white shadow-pop">
          <div className="border-b border-line px-4 py-3">
            <p className="text-[13px] font-semibold text-ink">Notifications</p>
            <p className="mt-0.5 text-xs text-muted">
              {waiting.length ?
            `${waiting.length} case${waiting.length === 1 ? '' : 's'} pending your review as ${roleLabel(role)}` :
            `Nothing needs your action as ${roleLabel(role)}`}
            </p>
          </div>
          {waiting.length > 0 &&
        <ul className="max-h-72 divide-y divide-line overflow-y-auto thin-scroll">
              {waiting.slice(0, 5).map((c) =>
          <li key={c.id}>
                  <Link
              to={`/quotes/${c.id}/evidence`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 transition-colors duration-150 hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
              
                    <p className="text-[13px] font-semibold text-ink">{c.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{stageLabel[c.approvalStage]} · {pendingText(pendingDays(c))}</p>
                  </Link>
                </li>
          )}
            </ul>
        }
          <div className="border-t border-line px-4 py-2.5">
            <Link
            to={role === 'ACTUARY' ? '/quotes' : '/approvals'}
            onClick={() => setOpen(false)}
            className="text-[13px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            
              {role === 'ACTUARY' ? 'Open quotes' : 'Open approval queue'}
            </Link>
          </div>
        </div>
      }
    </div>);

}
