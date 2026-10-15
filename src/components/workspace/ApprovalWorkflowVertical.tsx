import React from 'react';
import { CheckIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { ApprovalHistory, DeclineNotice } from './ApprovalHistory';
import { StageActionButtons } from './StageActionButtons';
import { wasReturned } from '../../utils/approvalFlow';
import type { ApprovalStage, QuoteCase } from '../../types';

const steps: {stage: ApprovalStage;label: string;}[] = [
{ stage: 'Pricing', label: 'Actuary Review' },
{ stage: 'Review', label: 'Actuary Lead Review' },
{ stage: 'Approval', label: 'Manager Review' },
{ stage: 'Final', label: 'SLT Lead Review' },
{ stage: 'Approved', label: 'Approved' }];


function formatStamp(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function ApprovalWorkflowVertical({ quote }: {quote: QuoteCase;}): JSX.Element {
  const allDone = quote.approvalStage === 'Approved';
  const returned = wasReturned(quote);
  const currentIndex = Math.max(0, steps.findIndex((s) => s.stage === quote.approvalStage));
  const last = quote.feed[quote.feed.length - 1];
  const owner = (last?.actor ?? 'Kiran Yeligeti').split(' ')[0];
  const stamp = formatStamp(last?.time ?? new Date().toISOString());

  return (
    <Card accent="primary" title="Approval Workflow">
      <DeclineNotice quote={quote} />
      <ol aria-label="Approval steps" className="mt-1">
        {steps.map((s, idx) => {
          const done = allDone || idx < currentIndex;
          const current = !allDone && idx === currentIndex;
          const isLast = idx === steps.length - 1;
          return (
            <li key={s.stage} aria-current={current ? 'step' : undefined} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold tnum ${
                  current && returned ?
                  'bg-danger text-white ring-4 ring-danger-tint' :
                  current ?
                  'bg-primary text-white ring-4 ring-primary-tint' :
                  done ?
                  'bg-success text-white' :
                  'border-2 border-line bg-white text-muted'}`
                  }>

                  {done ? <CheckIcon className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" /> : idx + 1}
                </span>
                {!isLast &&
                <span aria-hidden="true" className={`my-1 min-h-[20px] w-0.5 flex-1 rounded-full ${done ? 'bg-success' : 'bg-line'}`} />
                }
              </div>

              <div className={`min-w-0 flex-1 ${isLast ? '' : 'pb-5'}`}>
                <p className="pt-2 text-[15px] font-semibold leading-5 text-ink">{s.label}</p>
                {current ?
                <>
                    <span className={`mt-1.5 inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${returned ? 'bg-danger-tint text-[#B91C1C]' : 'bg-primary-tint text-primary'}`}>
                      {returned ? 'Declined, returned for changes' : 'In progress'}
                    </span>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary-tint text-sm font-semibold text-primary">
                        {owner.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-ink">{owner}</p>
                        <p className="text-xs text-muted tnum">{stamp}</p>
                      </div>
                    </div>
                  </> :

                <p className={`mt-0.5 text-[13px] ${done ? 'font-medium text-[#15803D]' : 'text-muted'}`}>
                    {done ? 'Completed' : 'Pending'}
                  </p>
                }
              </div>
            </li>);

        })}
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <StageActionButtons quote={quote} size="sm" />
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <ApprovalHistory quote={quote} />
      </div>
    </Card>);

}
