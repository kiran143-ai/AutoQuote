import React from 'react';
import { CheckCircleIcon, Clock, AlertCircle } from 'lucide-react';
import type { ApprovalStage, QuoteCase } from '../../types';

const stages: { stage: ApprovalStage; label: string; role: string }[] = [
  { stage: 'Draft', label: 'Create & Price', role: 'Actuary' },
  { stage: 'Pricing', label: 'Send for Review', role: 'Actuary Lead' },
  { stage: 'Review', label: 'Approve', role: 'Actuary Lead' },
  { stage: 'Approval', label: 'Manager Review', role: 'Manager' },
  { stage: 'Final', label: 'Final Review', role: 'SLT Lead' },
  { stage: 'Approved', label: 'Approved', role: 'System' }
];

export function ApprovalTimeline({ quote }: { quote: QuoteCase }): JSX.Element {
  const currentIndex = stages.findIndex(s => s.stage === quote.approvalStage);

  return (
    <div className="rounded-card border border-line bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-ink">Approval Workflow</h3>

      <div className="flex items-start justify-between gap-3">
        {stages.map((s, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;

          return (
            <div key={s.stage} className="flex flex-1 flex-col items-center">
              <div className="relative mb-2 flex items-center justify-center">
                {isCompleted ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success">
                    <CheckCircleIcon className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                ) : isCurrent ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary-tint">
                    <Clock className="h-4 w-4 text-primary" strokeWidth={2} />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-line bg-white">
                    <span className="text-xs font-semibold text-muted">{idx + 1}</span>
                  </div>
                )}

                {idx < stages.length - 1 && (
                  <div
                    className={`absolute left-full top-4 h-0.5 w-[calc(100%+8px)] ${
                      isCompleted ? 'bg-success' : 'bg-line'
                    }`}
                  />
                )}
              </div>

              <p className="text-center text-xs font-medium text-ink">{s.label}</p>
              <p className="text-center text-micro text-muted">{s.role}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
