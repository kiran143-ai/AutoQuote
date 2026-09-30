import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MailIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCaseStore } from '../../contexts/CaseStore';
import type { QuoteCase } from '../../types';

interface SubTab {
  label: string;
  to: string;
}
interface Group {
  key: string;
  label: string;
  to?: string;
  sub?: SubTab[];
}

const groups: Group[] = [
{ key: 'overview', label: 'Overview', to: 'overview' },
{
  key: 'setup',
  label: 'Setup',
  sub: [{ label: 'Census', to: 'census' }, { label: 'Configuration', to: 'config' }]
},
{
  key: 'pricing',
  label: 'Pricing',
  sub: [
  { label: 'Pricing Inputs', to: 'v2/pricing-inputs' },
  { label: 'Results', to: 'v2/pricing-results' },
  { label: 'Rounds', to: 'rounds' }]

},
{ key: 'illustration', label: 'Illustration', to: 'illustration' },
{ key: 'evidence', label: 'Evidence', to: 'evidence' }];


export function WorkspaceTabsV2({
  quote,
  showStickyReview = false
}: {quote: QuoteCase;showStickyReview?: boolean;}): JSX.Element {
  const { advanceApproval } = useCaseStore();
  const location = useLocation();
  const base = `/quotes/${quote.id}`;

  const isGroupActive = (g: Group) => {
    const paths = g.sub ? g.sub.map((s) => s.to) : [g.to!];
    return paths.some((p) => location.pathname === `${base}/${p}`);
  };
  const activeGroup = groups.find(isGroupActive);
  const isEvidenceActive = activeGroup?.key === 'evidence';

  return (
    <div className="sticky top-0 z-10 border-b border-line bg-white shadow-card">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-6">
        <nav aria-label="Case workspace" className="flex min-w-0 gap-1 overflow-x-auto overflow-y-hidden thin-scroll">
          {groups.map((g) => {
            const active = isGroupActive(g);
            return (
              <NavLink
                key={g.key}
                to={`${base}/${g.sub ? g.sub[0].to : g.to}`}
                className={`-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-3 text-[13px] font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                active ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-ink'}`
                }>

                {g.label}
              </NavLink>);

          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 py-2">
          <NavLink
            to={`${base}/history`}
            className="rounded-md border border-line px-3 py-1.5 text-[13px] font-medium text-muted transition-colors duration-150 ease-out hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

            History
          </NavLink>
          {isEvidenceActive && showStickyReview &&
          <Button
            variant="primary"
            size="sm"
            onClick={() => advanceApproval(quote.id, '')}
            icon={<MailIcon className="h-4 w-4" strokeWidth={1.75} />}>

              Send for Review
            </Button>
          }
        </div>
      </div>

      {activeGroup?.sub &&
      <div className="mx-auto flex w-full max-w-[1440px] gap-4 overflow-x-auto border-t border-line px-6">
          {activeGroup.sub.map((s) => {
          const active = location.pathname === `${base}/${s.to}`;
          return (
            <NavLink
              key={s.to}
              to={`${base}/${s.to}`}
              className={`shrink-0 px-1 py-2 text-[12px] font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              active ? 'text-primary' : 'text-muted hover:text-ink'}`
              }>

                {s.label}
              </NavLink>);

        })}
        </div>
      }
    </div>);

}
