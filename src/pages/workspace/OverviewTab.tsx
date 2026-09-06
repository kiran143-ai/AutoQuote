import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagonIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  PlayIcon,
  StarIcon,
  XIcon } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { useWorkspaceCase } from '../../hooks/useWorkspaceCase';
import { useCaseStore } from '../../contexts/CaseStore';
import { readinessSummary } from '../../utils/caseDerived';
import { productLabel } from '../../data/products';
import { currency } from '../../utils/format';

export function OverviewTab(): JSX.Element {
  const quote = useWorkspaceCase();
  const { runPricing, markLost } = useCaseStore();
  const navigate = useNavigate();
  const summary = readinessSummary(quote);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-5">
        <Card accent={summary.failed ? 'warning' : 'primary'}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ProgressRing
                value={summary.score}
                tone={summary.failed ? '#F59E0B' : '#16A34A'} />
              
              <div>
                <h2 className="text-[15px] font-semibold text-ink">
                  Submission Readiness
                </h2>
                <p className="mt-0.5 text-xs text-muted tnum">
                  {summary.passed} passed · {summary.failed} blocked ·{' '}
                  {summary.warned} warnings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-danger/40 bg-danger-tint px-2.5 py-1 text-xs font-medium text-[#B91C1C]">
                <AlertOctagonIcon
                  className="h-3.5 w-3.5"
                  strokeWidth={1.75}
                  aria-hidden="true" />
                
                {summary.failed} Blockers
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate(`/quotes/${quote.id}/evidence`)}>
                
                Review checks
              </Button>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
            <div
              className="h-full rounded-full bg-warning"
              style={{ width: `${summary.score}%` }} />
            
          </div>
        </Card>

        <Card title="Next actions">
          {!quote.priced ?
          <div className="rounded-md border border-primary/30 bg-primary-tint px-4 py-4">
              <p className="text-[13px] font-medium text-primary">
                Run pricing to generate the first round
              </p>
              <Button
              variant="primary"
              className="mt-3"
              onClick={() => runPricing(quote.id)}
              icon={<PlayIcon className="h-4 w-4" strokeWidth={1.75} />}>
              
                Run Pricing Now
              </Button>
            </div> :

          <div className="flex flex-wrap items-center gap-3 rounded-md border border-success/30 bg-success-tint px-4 py-3.5">
              <CheckCircle2Icon
              className="h-4 w-4 text-success"
              strokeWidth={1.75}
              aria-hidden="true" />
            
              <p className="text-[13px] text-[#15803D] tnum">
                Round {quote.round} priced · MVP{' '}
                {quote.metrics?.mvp.toFixed(2)}%. Continue in the Pricing tab.
              </p>
              <Button
              size="sm"
              variant="secondary"
              className="ml-auto"
              onClick={() => navigate(`/quotes/${quote.id}/pricing`)}>
              
                Open Pricing
              </Button>
            </div>
          }

          <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
            <Button
              variant="danger"
              size="sm"
              onClick={() => markLost(quote.id)}
              icon={<XIcon className="h-4 w-4" strokeWidth={2} />}>
              
              Mark Lost
            </Button>
            {quote.priced &&
            <Button
              variant="secondary"
              size="sm"
              onClick={() => runPricing(quote.id)}
              icon={<PlayIcon className="h-4 w-4" strokeWidth={1.75} />}>
              
                Run Pricing Now
              </Button>
            }
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        <Card title="Configuration snapshot" meta="Frozen at 2026-09-05. Repricing uses this snapshot.">
          <dl className="divide-y divide-line text-[13px]">
            {[
            ['Product', productLabel(quote.product)],
            ['Client', quote.client],
            ['Producer', quote.producer],
            ['Situs state', quote.situsState],
            ['Lives', `${quote.inputs.lives}`],
            ['Annual premium', currency(quote.inputs.premium)],
            ['Pay years', `${quote.inputs.payYears}`],
            ['M&E', `${quote.inputs.me} bps`]].
            map(([label, value]) =>
            <div key={label} className="flex justify-between gap-4 py-2">
                <dt className="text-muted">{label}</dt>
                <dd className="text-right font-medium text-ink tnum">{value}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card
          title="Save as Template"
          meta="Publish this case's parameters to the Template Marketplace for team reuse."
          action={
          <Button
            size="sm"
            variant="secondary"
            icon={<StarIcon className="h-4 w-4" strokeWidth={1.75} />}>
            
              Publish
            </Button>
          }>
          
          <p className="flex items-start gap-2 text-xs text-muted">
            <AlertTriangleIcon
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning"
              strokeWidth={1.75}
              aria-hidden="true" />
            
            Templates capture deal terms and configuration, not census data.
          </p>
        </Card>
      </div>
    </div>);

}