import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AlertTriangleIcon, MailIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCaseStore } from '../../contexts/CaseStore';
import type { QuoteCase } from '../../types';

export function hasPricingIssue(quote: QuoteCase): boolean {
  return !quote.priced || quote.inputs.me > 200;
}

export function WorkspaceTabs({
  quote,
  showStickyReview = false
}: {quote: QuoteCase;showStickyReview?: boolean;}): JSX.Element {
  const { advanceApproval } = useCaseStore();
  const location = useLocation();
  const isEvidenceTab = location.pathname.endsWith('/evidence');

  const tabs = [
  { slug: 'overview', label: 'Overview' },
  { slug: 'pricing', label: 'Pricing', primary: true },
  { slug: 'census', label: 'Census', count: quote.inputs.lives },
  { slug: 'config', label: 'Config' },
  { slug: 'illustration', label: 'Illustration' },
  { slug: 'rounds', label: 'Rounds', count: quote.round },
  { slug: 'history', label: 'History' },
  { slug: 'evidence', label: 'Evidence' }];


  return (
    <div className="sticky top-0 z-10 border-b border-line bg-white shadow-card">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-6">
        <nav
          aria-label="Case workspace"
          className="flex min-w-0 gap-1 overflow-x-auto overflow-y-hidden thin-scroll">

          {tabs.map((tab) =>
          <NavLink
            key={tab.slug}
            to={`/quotes/${quote.id}/${tab.slug}`}
            className={({ isActive }) =>
            `-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-3 text-[13px] transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            isActive ?
            'border-primary text-primary' :
            'border-transparent text-muted hover:text-ink'} ${
            tab.primary ? 'font-bold' : 'font-medium'}`
            }>

              {tab.label}
              {tab.count !== undefined &&
            <span className="rounded-full bg-canvas px-1.5 py-0.5 text-micro font-semibold text-muted tnum">
                  {tab.count}
                </span>
            }
              {tab.primary && hasPricingIssue(quote) &&
            <AlertTriangleIcon
              className="h-3.5 w-3.5 text-[#92400E]"
              strokeWidth={2}
              aria-label="Pricing has a pending issue" />

            }
            </NavLink>
          )}
        </nav>

        {isEvidenceTab && showStickyReview &&
        <div className="flex shrink-0 items-center py-2">
            <Button
            variant="primary"
            size="sm"
            onClick={() => advanceApproval(quote.id, '')}
            icon={<MailIcon className="h-4 w-4" strokeWidth={1.75} />}>

              Send for Review
            </Button>
          </div>
        }
      </div>
    </div>);

}
