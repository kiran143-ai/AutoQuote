import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState } from
'react';
import { defaultInputs, seedCases } from '../data/cases';
import { runPricingEngine } from '../utils/pricing';
import { useToast } from './ToastContext';
import type {
  ApprovalStage,
  CaseInputs,
  CaseStatus,
  ProductId,
  QuoteCase } from
'../types';

export const approvalStages: ApprovalStage[] = [
'Draft',
'Pricing',
'Review',
'Approval',
'Final',
'Approved'];


export const stageActionLabel: Record<ApprovalStage, string | null> = {
  Draft: 'Submit to Pricing',
  Pricing: 'Submit to Actuary Lead',
  Review: 'Approve (Actuary Lead)',
  Approval: 'Approve (Manager)',
  Final: 'Approve (Sr. Leadership)',
  Approved: null
};

export interface NewQuoteDraft {
  name: string;
  client: string;
  producer: string;
  situsState: string;
  dueDate: string;
  product: ProductId;
  inputs: Pick<CaseInputs, 'premium' | 'payYears' | 'saReturn' | 'faSpread'>;
}

interface CaseStoreValue {
  cases: QuoteCase[];
  getCase: (id: string) => QuoteCase | undefined;
  createCase: (draft: NewQuoteDraft) => QuoteCase;
  cloneCase: (id: string) => QuoteCase | undefined;
  runPricing: (id: string) => void;
  newRound: (id: string) => void;
  updateInputs: (id: string, patch: Partial<CaseInputs>) => void;
  advanceApproval: (id: string, comment: string) => void;
  markLost: (id: string) => void;
  addComment: (id: string, body: string) => void;
}

const CaseStoreContext = createContext<CaseStoreValue | null>(null);

const today = '2026-09-06';

function statusForStage(stage: ApprovalStage, priced: boolean): CaseStatus {
  if (stage === 'Approved') return 'Approved';
  if (stage === 'Draft') return priced ? 'Quoted' : 'Draft';
  return priced ? 'Quoted' : 'Draft';
}

export function CaseStoreProvider({
  children


}: {children: React.ReactNode;}): JSX.Element {
  const [cases, setCases] = useState<QuoteCase[]>(seedCases);
  const toast = useToast();

  const patchCase = useCallback(
    (id: string, updater: (c: QuoteCase) => QuoteCase) => {
      setCases((prev) => prev.map((c) => c.id === id ? updater(c) : c));
    },
    []
  );

  const getCase = useCallback(
    (id: string) => cases.find((c) => c.id === id),
    [cases]
  );

  const createCase = useCallback((draft: NewQuoteDraft): QuoteCase => {
    const inputs: CaseInputs = {
      ...defaultInputs,
      premium: draft.inputs.premium,
      payYears: draft.inputs.payYears,
      saReturn: draft.inputs.saReturn,
      faSpread: draft.inputs.faSpread
    };
    const next: QuoteCase = {
      id: `case-${Date.now()}`,
      name: draft.name,
      client: draft.client,
      producer: draft.producer,
      situsState: draft.situsState || 'DE',
      dueDate: draft.dueDate,
      product: draft.product,
      status: 'Draft',
      round: 1,
      updated: today,
      priced: false,
      inputs,
      metrics: null,
      approvalStage: 'Draft',
      censusSource: 'synthetic',
      feed: [
      {
        id: 'f1',
        kind: 'Case Created',
        actor: 'Kiran Yeligeti',
        detail: `Product: ${
        draft.product === 'EPPVUL_AVME' ?
        'EPPVUL — AV M&E (ICOLI)' :
        'EPPVUL — Premium-Based M&E'}`,

        time: new Date().toISOString()
      }]

    };
    setCases((prev) => [next, ...prev]);
    toast.success('Quote created', `${next.name} was saved as a draft.`);
    return next;
  }, [toast]);

  const cloneCase = useCallback(
    (id: string): QuoteCase | undefined => {
      const source = cases.find((c) => c.id === id);
      if (!source) return undefined;
      const next: QuoteCase = {
        ...source,
        id: `case-${Date.now()}`,
        name: `${source.name}_copy`,
        status: 'Draft',
        round: 1,
        updated: today,
        priced: false,
        metrics: null,
        approvalStage: 'Draft',
        inputs: { ...source.inputs },
        feed: [
        {
          id: 'f1',
          kind: 'Case Created',
          actor: 'Kiran Yeligeti',
          detail: `Cloned from ${source.name} — deal terms and configuration reused.`,
          time: new Date().toISOString()
        }]

      };
      setCases((prev) => [next, ...prev]);
      toast.success('Quote cloned', `${next.name} was created from ${source.name}.`);
      return next;
    },
    [cases, toast]
  );

  const runPricing = useCallback(
    (id: string) => {
      patchCase(id, (c) => ({
        ...c,
        priced: true,
        metrics: runPricingEngine(c.inputs),
        status: c.status === 'Draft' ? 'Quoted' : c.status,
        approvalStage: c.approvalStage === 'Draft' ? 'Pricing' : c.approvalStage,
        updated: today
      }));
      const c = cases.find((x) => x.id === id);
      const mvp = c ? runPricingEngine(c.inputs).mvp.toFixed(2) : null;
      toast.success('Pricing complete', mvp ? `MVP ${mvp}%. Results are updated.` : 'Results are updated.');
    },
    [patchCase, cases, toast]
  );

  const newRound = useCallback(
    (id: string) => {
      patchCase(id, (c) => ({
        ...c,
        round: c.round + 1,
        priced: true,
        metrics: runPricingEngine(c.inputs),
        updated: today
      }));
      const c = cases.find((x) => x.id === id);
      toast.success(c ? `Round ${c.round + 1} started` : 'New round started', 'Pricing ran on the current inputs.');
    },
    [patchCase, cases, toast]
  );

  const updateInputs = useCallback(
    (id: string, patch: Partial<CaseInputs>) => {
      patchCase(id, (c) => ({
        ...c,
        inputs: { ...c.inputs, ...patch },
        updated: today
      }));
    },
    [patchCase]
  );

  const advanceApproval = useCallback(
    (id: string, comment: string) => {
      patchCase(id, (c) => {
        const index = approvalStages.indexOf(c.approvalStage);
        const nextStage =
        approvalStages[Math.min(index + 1, approvalStages.length - 1)];
        const isApproval = c.approvalStage !== 'Draft';
        return {
          ...c,
          approvalStage: nextStage,
          status: statusForStage(nextStage, c.priced),
          updated: today,
          feed: [
          ...c.feed,
          {
            id: `f${c.feed.length + 1}`,
            kind: isApproval ? 'Approved' : 'Submitted for Approval',
            actor: 'Kiran Yeligeti',
            detail: `${isApproval ? 'approved' : 'submitted'} → ${nextStage}${
            nextStage === 'Review' ?
            ' (Actuary Lead)' :
            nextStage === 'Approval' ?
            ' (Manager)' :
            nextStage === 'Final' ?
            ' (Sr. Leadership)' :
            ''}.${
            comment ? ` ${comment}` : ''}`,
            time: new Date().toISOString()
          }]

        };
      });
      const c = cases.find((x) => x.id === id);
      if (c) {
        const nextStage = approvalStages[Math.min(approvalStages.indexOf(c.approvalStage) + 1, approvalStages.length - 1)];
        const label: Record<string, string> = {
          Pricing: 'Actuary Review',
          Review: 'Actuary Lead Review',
          Approval: 'Manager Review',
          Final: 'SLT Lead Review'
        };
        if (c.approvalStage === 'Approved') toast.info('Already approved', 'This quote has completed all approval steps.');else
        if (nextStage === 'Approved') toast.success('Quote approved', 'All approval steps are complete.');else
        toast.success('Sent for review', `Now with ${label[nextStage] ?? nextStage}.`);
      }
    },
    [patchCase, cases, toast]
  );

  const markLost = useCallback(
    (id: string) => {
      patchCase(id, (c) => ({ ...c, status: 'Lost', updated: today }));
      toast.warning('Quote marked as lost', 'You can still review it from the quotes list.');
    },
    [patchCase, toast]
  );

  const addComment = useCallback(
    (id: string, body: string) => {
      patchCase(id, (c) => ({
        ...c,
        feed: [
        ...c.feed,
        {
          id: `f${c.feed.length + 1}`,
          kind: 'Comment',
          actor: 'Kiran Yeligeti',
          detail: body,
          time: new Date().toISOString()
        }]

      }));
      toast.success('Comment posted');
    },
    [patchCase, toast]
  );

  const value = useMemo<CaseStoreValue>(
    () => ({
      cases,
      getCase,
      createCase,
      cloneCase,
      runPricing,
      newRound,
      updateInputs,
      advanceApproval,
      markLost,
      addComment
    }),
    [
    cases,
    getCase,
    createCase,
    cloneCase,
    runPricing,
    newRound,
    updateInputs,
    advanceApproval,
    markLost,
    addComment]

  );

  return (
    <CaseStoreContext.Provider value={value}>
      {children}
    </CaseStoreContext.Provider>);

}

export function useCaseStore(): CaseStoreValue {
  const ctx = useContext(CaseStoreContext);
  if (!ctx) throw new Error('useCaseStore must be used within CaseStoreProvider');
  return ctx;
}