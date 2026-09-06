import React from 'react';
import { CheckIcon, RotateCwIcon, TargetIcon, ZapIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MetricTile } from '../ui/MetricTile';
import { useCaseStore } from '../../contexts/CaseStore';
import { TARGET_MVP } from '../../utils/pricing';
import { signedPct } from '../../utils/format';
import type { QuoteCase } from '../../types';

export function CalibratePanel({ quote }: {quote: QuoteCase;}): JSX.Element {
  const { runPricing } = useCaseStore();
  const m = quote.metrics;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 rounded-card border border-line border-l-[3px] border-l-success bg-white px-4 py-3 shadow-card">
        <ZapIcon
          className="h-4 w-4 shrink-0 text-success"
          strokeWidth={1.75}
          aria-hidden="true" />
        
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[#15803D]">
            Auto-Priced at Creation
          </p>
          <p className="text-micro text-muted tnum">
            M&amp;E set to {quote.inputs.me} bps → MVP −34.51%
          </p>
        </div>
        <span className="ml-auto text-micro text-muted tnum">
          rd {quote.round}
        </span>
      </div>

      <Card
        accent="primary"
        title={
        <span className="flex items-center gap-2">
            <TargetIcon
            className="h-4 w-4 text-primary"
            strokeWidth={1.75}
            aria-hidden="true" />
          
            Auto-Calibrate to MVP Target
          </span>
        }
        meta="Engine solves for the M&E that achieves the governance target — no manual configuration needed."
        action={
        <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-micro uppercase tracking-[0.06em] text-muted">
                Target MVP
              </span>
              <span className="text-[13px] font-semibold text-ink tnum">
                {TARGET_MVP.toFixed(2)} %
              </span>
            </div>
            <Button
            size="sm"
            variant="secondary"
            onClick={() => runPricing(quote.id)}
            icon={<RotateCwIcon className="h-4 w-4" strokeWidth={1.75} />}>
            
              Recalculate
            </Button>
          </div>
        }>
        
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricTile
            label="Calibrated M&E"
            value={
            <>
                {m?.calibratedMe ?? quote.inputs.me}
                <span className="ml-1 text-xs font-medium text-muted">bps</span>
              </>
            }
            tone="success"
            emphasis
            className="border-success/40 bg-success-tint" />
          
          <MetricTile
            label="Achieved MVP"
            value={m ? `${m.mvp.toFixed(2)}%` : '—'}
            emphasis />
          
          <MetricTile
            label="Break-even"
            value={m ? `Mo ${m.breakEven}` : '—'}
            emphasis />
          
          <MetricTile
            label="Surplus Strain"
            value={m ? signedPct(m.strain, 1) : '—'}
            tone="warning"
            emphasis />
          
        </div>

        {m &&
        <p className="mt-3 flex items-center gap-2 rounded-md border border-success/30 bg-success-tint px-3.5 py-2.5 text-[13px] text-[#15803D] tnum">
            <CheckIcon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            Current M&amp;E ({quote.inputs.me} bps) is already at the calibrated
            value. Case is priced to target.
          </p>
        }

        <div className="mt-3 flex items-center justify-between text-micro text-muted tnum">
          <span>
            ✓ Converged in 8 iterations · Search range: 10–300 bps · Tolerance:
            ±0.01%
          </span>
          <button
            type="button"
            className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            
            ▸ Show Debug
          </button>
        </div>
      </Card>
    </div>);

}