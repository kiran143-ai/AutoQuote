import React from 'react';
import { CheckCircleIcon, Clock, MailIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import type { ApprovalStage, QuoteCase } from '../../types';

const steps: {stage: ApprovalStage;label: string;}[] = [
{ stage: 'Pricing', label: 'Actuary Review' },
{ stage: 'Review', label: 'Actuary Lead Review' },
{ stage: 'Approval', label: 'Manager Review' },
{ stage: 'Final', label: 'SLT Lead Review' },
{ stage: 'Approved', label: 'Approved' }];


export function ApprovalStepsCard({ quote }: {quote: QuoteCase;}): JSX.Element {
  const currentIndex = Math.max(0, steps.findIndex((s) => s.stage === quote.approvalStage));

  return (
    <div className="rounded-lg border-2 border-primary bg-primary-tint p-5">
      <div className="flex items-center gap-2">
        <CheckCircleIcon className="h-5 w-5 text-primary" strokeWidth={2} aria-hidden="true" />
        <div>
          <h2 className="text-[15px] font-bold text-primary">Approval Workflow</h2>
          <p className="text-xs text-primary/80">Submit for multi-level approval</p>
        </div>
      </div>

      <div className="mt-4 rounded-card border border-line bg-white p-5">
        <div className="relative">
          {steps.slice(0, -1).map((_, i) => {
            const isCompleted = i < currentIndex;
            const leftPct = (i + 0.5) / steps.length * 100;
            const widthPct = 1 / steps.length * 100;
            return (
              <div
                key={i}
                aria-hidden="true"
                className={`absolute top-4 h-0.5 ${isCompleted ? 'bg-success' : 'bg-line'}`}
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }} />);


          })}

          <div className="relative flex items-start justify-between">
            {steps.map((s, idx) => {
              const isCompleted = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div key={s.stage} className="flex flex-1 flex-col items-center">
                  <div className="mb-2 flex items-center justify-center">
                    {isCompleted ?
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success">
                        <CheckCircleIcon className="h-4 w-4 text-white" strokeWidth={2} />
                      </div> :
                    isCurrent ?
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary-tint">
                        <Clock className="h-4 w-4 text-primary" strokeWidth={2} />
                      </div> :

                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-line bg-white">
                        <span className="text-xs font-semibold text-muted">{idx + 1}</span>
                      </div>
                    }
                  </div>

                  <p
                    className={`max-w-[110px] text-center text-xs ${
                    isCurrent ? 'font-semibold text-primary' :
                    isCompleted ? 'font-medium text-ink' : 'font-medium text-muted'}`
                    }>

                    {s.label}
                  </p>
                </div>);

            })}
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t border-line pt-4">
          <Button variant="primary" icon={<MailIcon className="h-4 w-4" strokeWidth={1.75} />}>
            Send for Review
          </Button>
        </div>
      </div>
    </div>);

}
