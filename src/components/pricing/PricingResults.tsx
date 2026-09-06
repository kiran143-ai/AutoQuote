import React from 'react';
import { CheckIcon, TrendingDownIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { MetricTile } from '../ui/MetricTile';
import { currency, signedPct } from '../../utils/format';
import { TARGET_MVP } from '../../utils/pricing';
import type { QuoteCase } from '../../types';

export function PricingResults({ quote }: {quote: QuoteCase;}): JSX.Element {
  const m = quote.metrics;
  if (!m) {
    return (
      <Card title="Pricing results">
        <p className="rounded-md border border-dashed border-line bg-canvas px-4 py-6 text-center text-[13px] text-muted">
          Not yet priced. Run pricing to generate results for this round.
        </p>
      </Card>);

  }

  const onTarget = m.mvp >= TARGET_MVP;
  // Deal health position: MVP relative to the loss → profit band.
  const position = Math.min(98, Math.max(2, 50 + m.mvp / TARGET_MVP * 45));

  return (
    <Card title="Pricing results">
      <div className="flex items-center justify-between text-micro">
        <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.06em] text-muted">
          Deal Health
          <span className="rounded border border-line bg-canvas px-1.5 py-0.5 font-medium normal-case text-ink tnum">
            R/B 0.00 ✓
          </span>
        </span>
        <span
          className={`inline-flex items-center gap-1 font-semibold ${
          onTarget ? 'text-[#15803D]' : 'text-danger'}`
          }>
          
          <CheckIcon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          {onTarget ? 'On Target' : 'Below Target'}
        </span>
      </div>

      <div className="relative mt-2 h-3 overflow-hidden rounded-full">
        <div className="absolute inset-0 flex">
          <div className="h-full flex-[3] bg-danger-tint" />
          <div className="h-full flex-[2] bg-warning-tint" />
          <div className="h-full flex-[3] bg-success-tint" />
        </div>
        <div
          className="absolute top-0 h-full w-1.5 rounded-full bg-success"
          style={{ left: `${position}%` }} />
        
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted tnum">
        <span>← Loss</span>
        <span>0%</span>
        <span>Target {TARGET_MVP.toFixed(2)}%</span>
        <span>Profit →</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <MetricTile
          label="MVP"
          value={`${m.mvp.toFixed(2)}%`}
          tone="success"
          emphasis />
        
        <MetricTile label="Break-Even" value={`Mo ${m.breakEven}`} emphasis />
        <MetricTile
          label="Strain"
          value={signedPct(m.strain, 2)}
          tone="danger"
          emphasis />
        
        <MetricTile label="Commission" value={currency(m.commission)} emphasis />
        <MetricTile
          label="Risk-Adj MVP"
          value={`${m.riskAdjMvp.toFixed(2)}%`}
          hint="90/10 blend · worst 3.2%"
          emphasis />
        
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-md border border-warning/40 bg-warning-tint px-3.5 py-2.5">
        <TrendingDownIcon
          className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]"
          strokeWidth={1.75}
          aria-hidden="true" />
        
        <div className="text-[13px] tnum">
          <p className="font-medium text-[#92400E]">
            Spread Compression: −48 bps vs gold standard (400 bps)
          </p>
          <p className="text-micro text-muted">
            Cumulative income foregone: $7,617,069
          </p>
        </div>
      </div>
    </Card>);

}