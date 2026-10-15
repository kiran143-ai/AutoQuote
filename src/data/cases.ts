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

// Seed activity is dated relative to today so waiting-time chips (Aging/Overdue) don't fire on first load.
function daysAgo(days: number, hhmm: string): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${hhmm}:00`;
}

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
    actor: 'Scott (Actuary)',
    detail: 'Product: EPPVUL — AV M&E (ICOLI) · Auto-calibration failed',
    time: daysAgo(1, '13:23')
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
    actor: 'Scott (Actuary)',
    detail: 'Product: EPPVUL — AV M&E (ICOLI)',
    time: daysAgo(2, '09:12')
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