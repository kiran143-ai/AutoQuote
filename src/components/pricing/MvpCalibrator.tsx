import React from 'react';
import { BarChart3Icon, TargetIcon, ZapIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MetricTile } from '../ui/MetricTile';
import { CALIBRATOR_TARGET_MVP } from '../../utils/pricing';
import { signedPct } from '../../utils/format';
import type { QuoteCase } from '../../types';

export function MvpCalibrator({ quote }: {quote: QuoteCase;}): JSX.Element {
  const m = quote.metrics;
  const gap = m ? m.mvp - CALIBRATOR_TARGET_MVP : 0;

  return (
    <Card
      title={
      <span className="flex items-center gap-2">
          <TargetIcon
          className="h-4 w-4 text-primary"
          strokeWidth={1.75}
          aria-hidden="true" />
        
          MVP Calibrator
        </span>
      }
      meta={
      m ?
      `Current: ${m.mvp.toFixed(2)}% (${signedPct(gap, 2)} to target)` :
      'Not yet priced'
      }>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col rounded-md border border-line bg-canvas px-4 py-3">
          <label
            htmlFor="target-mvp"
            className="text-micro font-medium uppercase tracking-[0.06em] text-muted">
            
            Target MVP
          </label>
          <div className="mt-1 flex items-baseline gap-1">
            <input
              id="target-mvp"
              defaultValue={CALIBRATOR_TARGET_MVP.toFixed(2)}
              className="h-9 w-24 rounded-md border border-line bg-white px-2 text-lg font-semibold text-ink tnum focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            
            <span className="text-sm text-muted">%</span>
          </div>
        </div>
        <MetricTile
          label="Current MVP"
          value={m ? `${m.mvp.toFixed(2)}%` : '—'}
          tone="success"
          emphasis />
        
        <MetricTile
          label="Gap"
          value={m ? signedPct(gap, 2) : '—'}
          tone={gap >= 0 ? 'success' : 'danger'}
          emphasis
          className={gap >= 0 ? 'border-success/40 bg-success-tint' : undefined} />
        
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="primary"
          size="sm"
          icon={<BarChart3Icon className="h-4 w-4" strokeWidth={1.75} />}>
          
          Sensitivity Tornado
        </Button>
        <Button
          size="sm"
          icon={<TargetIcon className="h-4 w-4 text-primary" strokeWidth={1.75} />}>
          
          Goal-Seek (per lever)
        </Button>
        <Button
          size="sm"
          icon={<ZapIcon className="h-4 w-4 text-primary" strokeWidth={1.75} />}>
          
          Auto-Calibrate to {CALIBRATOR_TARGET_MVP.toFixed(2)}%
        </Button>
      </div>

      <div className="mt-4 rounded-md border border-line bg-canvas px-4 py-3">
        <p className="text-micro font-semibold uppercase tracking-[0.06em] text-muted">
          Assumptions consumed
        </p>
        <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-6">
          {[
          ['Eff. WACC', `${quote.inputs.wacc.toFixed(1)}%`],
          ['Credited Rate', `${quote.inputs.saReturn.toFixed(1)}%`],
          ['Proj Months', '372'],
          ['Prem Loads', 'OFF'],
          ['Expense Basis', 'Marginal'],
          ['FA Spread', `${quote.inputs.faSpread} bps`]].
          map(([label, value]) =>
          <div key={label}>
              <dt className="text-micro text-muted">{label}</dt>
              <dd className="text-[13px] font-semibold text-ink tnum">
                {value}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </Card>);

}