import React from 'react';
import { CheckCircle2Icon, CheckIcon, MailIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStageActions } from '../../contexts/ApprovalContext';
import { stageOwnerLabel } from '../../utils/approvalFlow';
import type { QuoteCase } from '../../types';

export function StageActionButtons({
  quote,
  size = 'md',
  compact = false,
  withDecline = true
}: {quote: QuoteCase;size?: 'sm' | 'md';compact?: boolean;withDecline?: boolean;}): JSX.Element | null {
  const { action, canDecline, run, decline } = useStageActions(quote);

  if (quote.approvalStage === 'Approved') {
    if (compact) return null;
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-success/40 bg-success-tint px-3 py-2 text-[13px] font-medium text-[#15803D]">
        <CheckCircle2Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        Approved
      </span>);

  }

  if (!action) {
    if (compact) return null;
    return (
      <span className="inline-flex items-center rounded-md border border-line bg-canvas px-3 py-2 text-[13px] font-medium text-muted">
        Awaiting {stageOwnerLabel[quote.approvalStage]}
      </span>);

  }

  return (
    <>
      {withDecline && canDecline &&
      <Button variant="danger" size={size} onClick={decline} icon={<XIcon className="h-4 w-4" strokeWidth={2} />}>
          Decline
        </Button>
      }
      <Button
        variant="primary"
        size={size}
        onClick={run}
        icon={action.kind === 'submit' ?
        <MailIcon className="h-4 w-4" strokeWidth={1.75} /> :
        <CheckIcon className="h-4 w-4" strokeWidth={2} />}>
        
        {action.label}
      </Button>
    </>);

}
