import React, { createContext, useContext, useMemo, useState } from 'react';
import { useCaseStore } from './CaseStore';
import { useRole } from './RoleContext';
import { DeclineDialog, SendForReviewDialog } from '../components/workspace/ApprovalDialogs';
import { actorLabel, canDeclineAt, primaryActionFor, type StageAction } from '../utils/approvalFlow';
import type { QuoteCase } from '../types';

interface ApprovalApi {
  submit: (id: string) => void;
  approve: (id: string) => void;
  decline: (id: string) => void;
}

const ApprovalContext = createContext<ApprovalApi | null>(null);

export function ApprovalProvider({ children }: {children: React.ReactNode;}): JSX.Element {
  const { getCase, advanceApproval, declineCase } = useCaseStore();
  const { role } = useRole();
  const [dialog, setDialog] = useState<{kind: 'submit' | 'decline';id: string;} | null>(null);

  const api = useMemo<ApprovalApi>(
    () => ({
      submit: (id) => setDialog({ kind: 'submit', id }),
      approve: (id) => advanceApproval(id, '', actorLabel(role)),
      decline: (id) => setDialog({ kind: 'decline', id })
    }),
    [advanceApproval, role]
  );

  const quote = dialog ? getCase(dialog.id) : undefined;
  const close = () => setDialog(null);

  return (
    <ApprovalContext.Provider value={api}>
      {children}
      {quote && dialog?.kind === 'submit' &&
      <SendForReviewDialog
        quote={quote}
        onClose={close}
        onConfirm={(note) => {
          advanceApproval(quote.id, note, actorLabel(role));
          close();
        }} />

      }
      {quote && dialog?.kind === 'decline' &&
      <DeclineDialog
        quote={quote}
        onClose={close}
        onConfirm={(comment) => {
          declineCase(quote.id, comment, actorLabel(role));
          close();
        }} />

      }
    </ApprovalContext.Provider>);

}

export function useApproval(): ApprovalApi {
  const ctx = useContext(ApprovalContext);
  if (!ctx) throw new Error('useApproval must be used within ApprovalProvider');
  return ctx;
}

export function useStageActions(quote: QuoteCase): {
  action: StageAction | null;
  canDecline: boolean;
  run: () => void;
  decline: () => void;
} {
  const { role } = useRole();
  const approval = useApproval();
  const action = primaryActionFor(role, quote.approvalStage);
  return {
    action,
    canDecline: canDeclineAt(role, quote.approvalStage),
    run: () => {
      if (!action) return;
      if (action.kind === 'submit') approval.submit(quote.id);else
      approval.approve(quote.id);
    },
    decline: () => approval.decline(quote.id)
  };
}
