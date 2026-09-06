export interface ConfigSection {
  id: string;
  name: string;
  tag: 'EDITED' | 'FALLBACK';
}

export const configSections: ConfigSection[] = [
{ id: 'coi', name: 'COI rates', tag: 'EDITED' },
{ id: 'corridor', name: 'Corridor factors', tag: 'FALLBACK' },
{ id: 'crediting', name: 'Crediting rates', tag: 'FALLBACK' },
{ id: 'lapse', name: 'Lapse schedule', tag: 'FALLBACK' },
{ id: 'commissions', name: 'Commissions', tag: 'FALLBACK' },
{ id: 'premium-loads', name: 'Premium loads', tag: 'FALLBACK' },
{ id: 'surrender', name: 'Surrender charges', tag: 'FALLBACK' },
{ id: 'expenses', name: 'Expenses', tag: 'FALLBACK' },
{ id: 'tax-rbc', name: 'Tax & RBC', tag: 'FALLBACK' },
{ id: 'reinsurance', name: 'Reinsurance', tag: 'FALLBACK' },
{ id: 'irc7702', name: 'IRC §7702', tag: 'FALLBACK' },
{ id: 'seven-pay', name: 'Seven-Pay & NPT', tag: 'FALLBACK' },
{ id: 'car', name: 'CAR tables', tag: 'FALLBACK' },
{ id: 'targets', name: 'Targets', tag: 'FALLBACK' },
{ id: 'reg74', name: 'Reg 74 indices', tag: 'FALLBACK' },
{ id: 'policy-charges', name: 'Policy charges', tag: 'FALLBACK' },
{ id: 'compensation', name: 'Compensation', tag: 'FALLBACK' },
{ id: 'loan-rates', name: 'Loan rates', tag: 'FALLBACK' },
{ id: 'mortality', name: 'Mortality assumptions', tag: 'FALLBACK' },
{ id: 'inforce', name: 'Inforce parameters', tag: 'FALLBACK' }];


export interface CorridorBand {
  age: number;
  factor: number;
  naar: number;
}

export const corridorBands: CorridorBand[] = [
{ age: 40, factor: 2.5, naar: 150 },
{ age: 45, factor: 2.15, naar: 115 },
{ age: 50, factor: 1.85, naar: 85 },
{ age: 55, factor: 1.5, naar: 50 },
{ age: 60, factor: 1.3, naar: 30 },
{ age: 65, factor: 1.2, naar: 20 },
{ age: 70, factor: 1.15, naar: 15 },
{ age: 75, factor: 1.05, naar: 5 },
{ age: 80, factor: 1.05, naar: 5 },
{ age: 85, factor: 1.05, naar: 5 },
{ age: 90, factor: 1.04, naar: 4 },
{ age: 95, factor: 1.02, naar: 2 },
{ age: 100, factor: 1.0, naar: 0 }];


export const configValidation = [
{
  title: 'Age coverage complete',
  detail: 'Every integer age 40–100 resolves to a band.',
  state: 'pass' as const
},
{
  title: 'All values within plausible range',
  detail: '13 bands checked.',
  state: 'pass' as const
}];