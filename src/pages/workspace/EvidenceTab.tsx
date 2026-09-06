import React from 'react';
import {
  AlertTriangleIcon,
  CheckIcon,
  DownloadIcon,
  LockIcon,
  XIcon } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { MetricTile } from '../../components/ui/MetricTile';
import { useWorkspaceCase } from '../../hooks/useWorkspaceCase';
import { readinessChecks, readinessSummary } from '../../utils/caseDerived';
import { governanceThresholds } from '../../data/analysisTools';
import { premiumShort, signedPct } from '../../utils/format';

export function EvidenceTab(): JSX.Element {
  const quote = useWorkspaceCase();
  const checks = readinessChecks(quote);
  const summary = readinessSummary(quote);
  const m = quote.metrics;

  return (
    <div className="space-y-5">
      {summary.failed > 0 &&
      <div
        role="alert"
        className="flex items-start gap-2.5 rounded-card border border-danger/40 bg-danger-tint px-4 py-3 shadow-card">
        
          <AlertTriangleIcon
          className="mt-0.5 h-4 w-4 shrink-0 text-danger"
          strokeWidth={1.75}
          aria-hidden="true" />
        
          <div>
            <p className="text-[13px] font-semibold text-[#B91C1C]">
              {summary.failed} blocker
              {summary.failed === 1 ? '' : 's'} present at submission
            </p>
            <p className="mt-0.5 text-micro text-muted tnum">
              Readiness score: {summary.score}% · {summary.passed}/
              {summary.total} checks passed
            </p>
          </div>
        </div>
      }

      <Card
        accent="primary"
        title="Evidence Packet"
        meta={`Frozen at submission · 9/5/2026, 2:11:34 PM · by Kiran Yeligeti`}
        action={
        <>
            <Button
            size="sm"
            variant="secondary"
            icon={<DownloadIcon className="h-4 w-4" strokeWidth={1.75} />}>
            
              Export PDF
            </Button>
            <span className="inline-flex items-center gap-1 rounded-md border border-line bg-canvas px-2.5 py-1.5 text-micro font-medium text-muted">
              <LockIcon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              Read-only snapshot
            </span>
          </>
        }>
        
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <ProgressRing value={summary.score} size={64} />
          </div>
          <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricTile
              label="MVP"
              value={m ? `${m.mvp.toFixed(2)}%` : '—'}
              tone="success"
              emphasis />
            
            <MetricTile
              label="Strain"
              value={m ? signedPct(m.strain, 2) : '—'}
              tone="warning" />
            
            <MetricTile label="M&E" value={`${quote.inputs.me} bps`} />
            <MetricTile
              label="Premium"
              value={premiumShort(quote.inputs.premium)} />
            
            <MetricTile label="Lives" value={quote.inputs.lives} />
            <MetricTile label="Round" value={`#${quote.round}`} />
            <MetricTile
              label="Break-even"
              value={m ? `Mo ${m.breakEven}` : '—'} />
            
          </div>
        </div>
      </Card>

      <Card title="Governance Thresholds" meta="at submission">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {governanceThresholds.map((t) =>
          <div
            key={t.label}
            className="flex items-baseline justify-between rounded-md border border-line bg-canvas px-3.5 py-2.5">
            
              <span className="text-micro uppercase tracking-[0.06em] text-muted">
                {t.label}
              </span>
              <span className="text-[13px] font-semibold text-ink tnum">
                {t.value}
              </span>
            </div>
          )}
        </div>
      </Card>

      <Card
        title="Readiness Checks"
        meta={`${summary.passed} pass · ${summary.failed} fail · ${summary.warned} warn`}>
        
        <ul className="space-y-1.5">
          {checks.map((check) => {
            const tone =
            check.state === 'pass' ?
            'border-success/25 bg-success-tint' :
            check.state === 'fail' ?
            'border-danger/30 bg-danger-tint' :
            'border-warning/40 bg-warning-tint';
            return (
              <li
                key={check.label}
                className={`flex flex-wrap items-center justify-between gap-2 rounded-md border px-3.5 py-2.5 ${tone}`}>
                
                <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
                  {check.state === 'pass' &&
                  <CheckIcon
                    className="h-4 w-4 text-success"
                    strokeWidth={2}
                    aria-hidden="true" />

                  }
                  {check.state === 'fail' &&
                  <XIcon
                    className="h-4 w-4 text-danger"
                    strokeWidth={2}
                    aria-hidden="true" />

                  }
                  {check.state === 'warn' &&
                  <AlertTriangleIcon
                    className="h-4 w-4 text-warning"
                    strokeWidth={1.75}
                    aria-hidden="true" />

                  }
                  <span
                    className={
                    check.state === 'fail' ? 'text-[#B91C1C]' : undefined
                    }>
                    
                    {check.label}
                  </span>
                </span>
                <span className="text-micro text-muted tnum">
                  {check.value}
                </span>
              </li>);

          })}
        </ul>
      </Card>
    </div>);

}