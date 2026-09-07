import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon, PlusIcon, RotateCwIcon } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { CheckChip } from '../ui/CheckChip';
import { Button } from '../ui/Button';
import { caseSummaryLine, validationChips } from '../../utils/caseDerived';
import { premiumShort, signedPct } from '../../utils/format';
import { useCaseStore } from '../../contexts/CaseStore';
import type { QuoteCase } from '../../types';

export function CaseHeader({ quote }: {quote: QuoteCase;}): JSX.Element {
  const { runPricing, newRound } = useCaseStore();
  const m = quote.metrics;

  const isCloned = quote.feed[0]?.detail.includes('Cloned from');
  const clonedFromMatch = quote.feed[0]?.detail.match(/Cloned from (.+?) —/);
  const clonedFromName = clonedFromMatch?.[1];

  return (
    <div className="border-b border-line bg-white">
      {isCloned && (
        <div className="border-b border-line bg-primary-tint px-6 py-3">
          <div className="mx-auto max-w-[1440px] flex items-start gap-3">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2} aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">
                Cloned from <span className="font-semibold">{clonedFromName}</span>
              </p>
              <p className="mt-1 text-xs text-primary/80">
                Configuration and census pre-loaded. Just update the client details and client name to get started.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-[1440px] px-6 pb-4 pt-4">
        <Link
          to="/quotes"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          
          <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          Quotes
        </Link>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[22px] font-bold leading-7 tracking-[-0.01em] text-ink">
                {quote.name}
              </h1>
              <StatusBadge status={quote.status} />
              <span className="text-xs text-muted tnum">
                Round {quote.round}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-muted">
              {caseSummaryLine(quote)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => runPricing(quote.id)}
              icon={<RotateCwIcon className="h-4 w-4" strokeWidth={1.75} />}>
              
              Re-run
            </Button>
            <Button
              variant="primary"
              onClick={() => newRound(quote.id)}
              icon={<PlusIcon className="h-4 w-4" strokeWidth={2} />}>
              
              New Round
            </Button>
          </div>
        </div>

        {m ?
        <dl className="mt-3 flex flex-wrap items-baseline gap-x-8 gap-y-2">
            <MetricInline label="MVP" value={`${m.mvp.toFixed(2)}%`} tone="success" />
            <MetricInline label="Break-even" value={`Mo ${m.breakEven}`} />
            <MetricInline
            label="Strain"
            value={signedPct(m.strain, 1)}
            tone="danger" />
          
            <MetricInline
            label="Premium"
            value={premiumShort(quote.inputs.premium)} />
          
          </dl> :

        <p className="mt-3 text-[13px] text-muted">Not yet priced</p>
        }

        <div className="mt-3 flex flex-wrap gap-2">
          {validationChips(quote).map((chip) =>
          <CheckChip key={chip.label} label={chip.label} state={chip.state} />
          )}
        </div>
      </div>
    </div>);

}

function MetricInline({
  label,
  value,
  tone = 'default'




}: {label: string;value: string;tone?: 'default' | 'success' | 'danger';}): JSX.Element {
  const tones = {
    default: 'text-ink',
    success: 'text-[#15803D]',
    danger: 'text-danger'
  };
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-micro font-medium uppercase tracking-[0.06em] text-muted">
        {label}
      </dt>
      <dd className={`text-lg font-semibold tnum ${tones[tone]}`}>{value}</dd>
    </div>);

}