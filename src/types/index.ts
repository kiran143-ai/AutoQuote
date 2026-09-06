export type CaseStatus =
'Draft' |
'Quoted' |
'Approved' |
'Won' |
'Declined' |
'Lost';

export type ApprovalStage =
'Draft' |
'Pricing' |
'Review' |
'Approval' |
'Final' |
'Approved';

export type ProductId = 'EPPVUL_AVME' | 'EPPVUL_PBME';

export interface CaseInputs {
  me: number;
  saReturn: number;
  faSpread: number;
  saAllocation: number;
  premium: number;
  payYears: number;
  faceAmount: number;
  issueAge: number;
  mortalityAge: number;
  lives: number;
  wacc: number;
  commissionY1: number;
  trail: number;
  revShare: number;
  projectionMo: number;
}

export interface PricingMetrics {
  mvp: number;
  breakEven: number;
  strain: number;
  commission: number;
  riskAdjMvp: number;
  calibratedMe: number;
}

export type FeedKind =
'Approved' |
'Submitted for Approval' |
'Case Created' |
'Comment';

export interface FeedEntry {
  id: string;
  kind: FeedKind;
  actor: string;
  detail: string;
  time: string;
}

export interface QuoteCase {
  id: string;
  name: string;
  client: string;
  producer: string;
  situsState: string;
  dueDate: string;
  product: ProductId;
  status: CaseStatus;
  round: number;
  updated: string;
  priced: boolean;
  inputs: CaseInputs;
  metrics: PricingMetrics | null;
  approvalStage: ApprovalStage;
  censusSource: 'synthetic' | 'actual';
  feed: FeedEntry[];
}

export interface ValidationChip {
  label: string;
  state: 'pass' | 'pending';
}