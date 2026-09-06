import type { CaseInputs, QuoteCase } from '../types';

export const defaultInputs: CaseInputs = {
  me: 300,
  saReturn: 7,
  faSpread: 352,
  saAllocation: 0,
  premium: 5000000,
  payYears: 7,
  faceAmount: 500000,
  issueAge: 55,
  mortalityAge: 86,
  lives: 30,
  wacc: 7.5,
  commissionY1: 0.07,
  trail: 10,
  revShare: 0,
  projectionMo: 0
};

export const seedCases: QuoteCase[] = [
{
  id: 'us-bank-01',
  name: 'US Bank_01',
  client: 'US Bank_Steve',
  producer: 'Goldman',
  situsState: 'DE',
  dueDate: '',
  product: 'EPPVUL_AVME',
  status: 'Quoted',
  round: 3,
  updated: '2026-09-05',
  priced: true,
  inputs: { ...defaultInputs },
  metrics: {
    mvp: 3.25,
    breakEven: 197,
    strain: -109.2,
    commission: 1905045,
    riskAdjMvp: 3.21,
    calibratedMe: 300
  },
  approvalStage: 'Pricing',
  censusSource: 'synthetic',
  feed: [
  {
    id: 'f1',
    kind: 'Case Created',
    actor: 'Kiran Yeligeti',
    detail: 'Product: EPPVUL — AV M&E (ICOLI) · Auto-calibration failed',
    time: '2026-09-05T13:23:00'
  },
  {
    id: 'f2',
    kind: 'Submitted for Approval',
    actor: 'Kiran Yeligeti',
    detail: 'submitted → Review (Actuary Lead).',
    time: '2026-09-05T14:03:00'
  },
  {
    id: 'f3',
    kind: 'Approved',
    actor: 'Kiran Yeligeti',
    detail: 'approved → Approval (Manager). test',
    time: '2026-09-05T14:05:00'
  },
  {
    id: 'f4',
    kind: 'Approved',
    actor: 'Kiran Yeligeti',
    detail: 'approved → Final (Sr. Leadership). test',
    time: '2026-09-05T14:05:00'
  },
  {
    id: 'f5',
    kind: 'Approved',
    actor: 'Kiran Yeligeti',
    detail: 'approved → Approved. test',
    time: '2026-09-05T14:06:00'
  }]

},
{
  id: 'regional-bank',
  name: 'regional bank',
  client: 'Chase bank',
  producer: 'Goldman Sachs',
  situsState: 'DE',
  dueDate: '2026-09-24',
  product: 'EPPVUL_AVME',
  status: 'Draft',
  round: 1,
  updated: '2026-09-04',
  priced: false,
  inputs: { ...defaultInputs },
  metrics: null,
  approvalStage: 'Draft',
  censusSource: 'synthetic',
  feed: [
  {
    id: 'f1',
    kind: 'Case Created',
    actor: 'Kiran Yeligeti',
    detail: 'Product: EPPVUL — AV M&E (ICOLI)',
    time: '2026-09-04T09:12:00'
  }]

}];


export const statusFilters = [
'All',
'Draft',
'Quoted',
'Approved',
'Won',
'Declined',
'Lost'] as
const;