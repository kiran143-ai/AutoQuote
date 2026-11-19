// Sample roll-forward data (Round 1 → Round 2) for the Rounds tab prototype.

export type Cell = number | string | null;

export interface RollStep {
  index: number;
  name: string;
  group: number;
  kind: 'Baseline' | 'Iteration result' | 'Step change';
  change?: {label: string;from: string;to: string;};
}

export const rollSteps: RollStep[] = [
{ index: 0, name: 'R1 Final', group: 0, kind: 'Baseline' },
{ index: 1, name: 'R2 Iter 1', group: 1, kind: 'Iteration result', change: { label: 'M&E', from: '59', to: '89 bps' } },
{ index: 2, name: 'Update FA Spread', group: 2, kind: 'Step change', change: { label: 'FA spread', from: '80', to: '50 bps' } },
{ index: 3, name: 'R2 Iter 2', group: 2, kind: 'Iteration result' }];


export const groupLabels = ['Baseline', 'Iteration 1', 'Iteration 2'];

export const iterations = [
{ label: 'R2 Iter 1', from: 1, to: 1, tone: 'primary' as const },
{ label: 'R2 Iter 2', from: 2, to: 3, tone: 'success' as const }];


export interface DiffRow {
  key: string;
  label: string;
  values: Cell[];
  format: (v: Cell) => string;
  delta?: (d: number) => string;
  better?: 'higher' | 'lower' | null;
  strong?: boolean;
}

const num = (fn: (n: number) => string) => (v: Cell) => typeof v === 'number' ? fn(v) : v === null ? '—' : String(v);
const minus = (n: number) => n < 0 ? '−' : '';
const signed = (d: number, digits: number, suffix = '') =>
Math.abs(d) < 1e-9 ? `0${digits ? `.${'0'.repeat(digits)}` : ''}${suffix}` : `${d > 0 ? '+' : '−'}${Math.abs(d).toFixed(digits)}${suffix}`;

export const money = (v: number): string => {
  const a = Math.abs(v);
  const body = a >= 1e6 ? `$${(a / 1e6).toFixed(2)}M` : a >= 1e3 ? `$${(a / 1e3).toFixed(1)}K` : `$${Math.round(a)}`;
  return `${minus(v)}${body}`;
};

const pct2 = num((n) => `${n.toFixed(2)}%`);
const bps1 = num((n) => `${n.toFixed(1)} bps`);

export const metricRows: DiffRow[] = [
{ key: 'me', label: 'M&E (bps)', values: [59, 89, 89, 89], format: bps1, delta: (d) => signed(d, 1), better: null },
{ key: 'mvp', label: 'MVP (%)', values: [-106.483, -105.916, -106.132, -106.132], format: pct2, delta: (d) => signed(d, 3, '%'), better: 'higher', strong: true },
{ key: 'mvpTarget', label: 'MVP Target (%)', values: [3.23, 3.23, 3.23, 3.23], format: pct2, better: null },
{ key: 'mva', label: 'MVA (%)', values: [-106.483, -105.916, -106.132, -106.132], format: pct2, delta: (d) => signed(d, 3, '%'), better: 'higher', strong: true },
{ key: 'rb', label: 'R/B', values: [0, 0, 0, 0], format: pct2, better: null },
{ key: 'rbTarget', label: 'R/B Target', values: [140, 140, 140, 140], format: pct2, better: null },
{ key: 'irr', label: 'Marginal IRR', values: [7.76, 7.76, 7.76, 7.76], format: pct2, better: 'higher' },
{ key: 'bey', label: 'BEY', values: [null, null, null, null], format: num(() => '—'), better: null }];


export const rawRows: DiffRow[] = [
{ key: 'pvProfits', label: 'PV Profits', values: [-52.91e6, -52.62e6, -52.74e6, -52.74e6], format: num(money), delta: (d) => `${d > 0 ? '+' : '−'}${money(Math.abs(d))}`, better: 'higher' },
{ key: 'pvPremiums', label: 'PV Premiums', values: [49.69e6, 49.69e6, 49.69e6, 49.69e6], format: num(money), better: 'higher' },
{ key: 'strain', label: 'Surplus Strain', values: [-103.47, -103.47, -103.47, -103.47], format: num((n) => n.toFixed(2)), better: 'higher' },
{ key: 'commission', label: 'Total Commission', values: [49.34e6, 49.34e6, 49.31e6, 49.31e6], format: num(money), delta: (d) => `${d > 0 ? '+' : '−'}${money(Math.abs(d))}`, better: 'lower' },
{ key: 'spreadComp', label: 'Spread Compression (bps)', values: [320, 350, 350, 350], format: num((n) => n.toFixed(2)), delta: (d) => signed(d, 2), better: null }];


export const inputRows: DiffRow[] = [
{ key: 'product', label: 'Product', values: ['EPPVUL — AV M&E (ICOLI)', 'EPPVUL — AV M&E (ICOLI)', 'EPPVUL — AV M&E (ICOLI)', 'EPPVUL — AV M&E (ICOLI)'], format: num(() => '') },
{ key: 'me', label: 'M&E (bps)', values: [59, 89, 89, 89], format: bps1, delta: (d) => signed(d, 1), better: null },
{ key: 'faSpread', label: 'FA spread (bps)', values: [80, 80, 50, 50], format: bps1, delta: (d) => signed(d, 1), better: null },
{ key: 'premium', label: 'Premium', values: [50e6, 50e6, 50e6, 50e6], format: num(money), better: null },
{ key: 'lives', label: 'Lives', values: [1250, 1250, 1250, 1250], format: num((n) => n.toLocaleString('en-US')), better: null }];


// ───────── Income statement ─────────

export interface IncomeLine {
  label: string;
  values: number[];
  bold?: boolean;
}

const YEARS = 39;

function expand(first10: number[], growth: number): number[] {
  const out = [...first10];
  for (let y = first10.length; y < YEARS; y++) out.push(out[y - 1] * growth);
  return out;
}
const pad = (first: number): number[] => [first, ...Array(YEARS - 1).fill(0)];
const sum = (...lines: number[][]): number[] => lines[0].map((_, i) => lines.reduce((s, l) => s + l[i], 0));

const base = {
  premium: pad(50_000_000),
  inv: expand([20_100, 15_300, 33_900, 56_400, 73_000, 79_200, 87_500, 95_000, 103_200, 114_100], 1.05),
  fee: expand([229, 1_600, 4_000, 6_900, 8_700, 9_500, 10_400, 11_300, 12_300, 13_400], 1.06),
  coi: expand([455, 751, 1_000, 1_200, 1_300, 1_600, 1_700, 1_900, 2_100, 2_400], 1.08),
  death: expand([617, 1_100, 1_800, 2_400, 3_000, 3_800, 4_300, 5_100, 6_000, 7_000], 1.1),
  surrender: expand([14, 554, 2_600, 10_300, 13_500, 14_700, 16_000, 17_400, 18_900, 20_600], 1.07),
  commission: expand([49_930_000, -285_900, -329_900, -371_900, 1_900, 2_100, 2_200, 2_400, 2_700, 2_900], 0.97),
  expense: expand([150_200, 151, 151, 150, 148, 146, 144, 143, 141, 139], 0.99),
  premTax: pad(625_000),
  reins: expand([473, 781, 1_100, 1_200, 1_300, 1_600, 1_700, 2_000, 2_200, 2_400], 1.08),
  reserve: expand([67_300, 305_300, 379_300, 458_300, 108_000, 117_400, 127_900, 139_200, 151_500, 165_000], 1.06),
  surplus: expand([86_700, 1_100, 4_100, 7_300, 4_000, 2_900, 3_300, 3_800, 4_400, 5_100], 1.05),
  tax: expand([895_100, 95_300, 92_300, 88_500, 87_700, 87_100, 86_500, 85_500, 84_500, 83_700], 0.99),
  book: expand([-51_733_500, -98_700, -107_400, -118_300, -119_100, -119_900, -121_200, -123_600, -126_300, -127_700], 1.015)
};

const scales = [
{ fee: 1, inv: 1 },
{ fee: 1.508, inv: 1 },
{ fee: 1.508, inv: 0.987 },
{ fee: 1.508, inv: 0.987 }];


export function incomeStatement(step: number): IncomeLine[] {
  const s = scales[step] ?? scales[0];
  const inv = base.inv.map((v) => v * s.inv);
  const fee = base.fee.map((v) => v * s.fee);
  const book = base.book.map((v, i) => v + (fee[i] - base.fee[i]) + (inv[i] - base.inv[i]));
  const cumulative = book.reduce<number[]>((acc, v, i) => [...acc, (acc[i - 1] ?? 0) + v], []);
  const totalIncome = sum(base.premium, inv, fee, base.coi);
  const totalOutgo = sum(base.death, base.surrender, base.commission, base.expense, base.premTax, base.reins);

  return [
  { label: 'Premium Income', values: base.premium },
  { label: 'Investment Income', values: inv },
  { label: 'Fee Income (M&E)', values: fee },
  { label: 'COI Margin', values: base.coi },
  { label: 'Total Income', values: totalIncome, bold: true },
  { label: 'Death Outgo', values: base.death },
  { label: 'Surrender Outgo', values: base.surrender },
  { label: 'Commission Outgo', values: base.commission },
  { label: 'Expense Outgo', values: base.expense },
  { label: 'Premium Tax Outgo', values: base.premTax },
  { label: 'Reinsurance Outgo', values: base.reins },
  { label: 'Total Outgo', values: totalOutgo, bold: true },
  { label: 'Reserve Increase', values: base.reserve },
  { label: 'Surplus Increase', values: base.surplus },
  { label: 'Federal Income Tax', values: base.tax },
  { label: 'Book Profit', values: book, bold: true },
  { label: 'Cumulative Book Profit', values: cumulative, bold: true }];

}

export const projectionRows = (): DiffRow[] => {
  const stmts = rollSteps.map((s) => incomeStatement(s.index));
  const pick = (label: string, year: number) => stmts.map((st) => st.find((l) => l.label === label)!.values[year - 1]);
  const diff = (d: number) => `${d > 0 ? '+' : '−'}${money(Math.abs(d))}`;
  return [
  { key: 'bp1', label: 'Year 1 Book Profit', values: pick('Book Profit', 1), format: num(money), delta: diff, better: 'higher' },
  { key: 'bp2', label: 'Year 2 Book Profit', values: pick('Book Profit', 2), format: num(money), delta: diff, better: 'higher' },
  { key: 'bp10', label: 'Year 10 Book Profit', values: pick('Book Profit', 10), format: num(money), delta: diff, better: 'higher' },
  { key: 'cum10', label: 'Cumulative Book Profit (Yr 10)', values: pick('Cumulative Book Profit', 10), format: num(money), delta: diff, better: 'higher' }];

};

// ───────── Deep diff ─────────

export interface DiffSection {
  id: string;
  label: string;
  rows: DiffRow[];
}

export const diffSections = (): DiffSection[] => [
{ id: 'inputs', label: 'Inputs', rows: inputRows },
{ id: 'metrics', label: 'Metrics', rows: [...metricRows, ...rawRows] },
{ id: 'census', label: 'Census', rows: [] },
{ id: 'governance', label: 'Governance', rows: [] },
{ id: 'evidence', label: 'Evidence', rows: [] },
{ id: 'projections', label: 'Projections', rows: projectionRows() },
{ id: 'config', label: 'Config', rows: [] }];


export const keyDeltaRows = (): DiffRow[] => {
  const get = (rows: DiffRow[], key: string) => rows.find((r) => r.key === key)!;
  const proj = projectionRows();
  return [
  { ...get(metricRows, 'mvp'), label: 'MVP (%)' },
  { ...get(metricRows, 'mva'), label: 'MVA (%)' },
  { ...get(metricRows, 'irr'), label: 'IRR' },
  { ...get(rawRows, 'pvProfits'), label: 'PV Profits' },
  { ...get(rawRows, 'pvPremiums'), label: 'PV Premiums' },
  { ...get(rawRows, 'strain'), label: 'Surplus Strain' },
  { key: 'breakEven', label: 'Break-even Month', values: [0, 0, 0, 0], format: num((n) => n.toFixed(0)), better: 'lower' },
  { ...get(rawRows, 'commission'), label: 'Total Commission' },
  { ...get(rawRows, 'spreadComp'), label: 'Spread Compression (bps)' },
  { ...get(proj, 'bp1'), label: 'Year 1 Book Profit' },
  { ...get(proj, 'bp2'), label: 'Year 2 Book Profit' },
  { key: 'rbRatio', label: 'R/B Ratio', values: [0, 0, 0, 0], format: num((n) => n.toFixed(2)), better: null }];

};

export const changed = (row: DiffRow, from: number, to: number): boolean => {
  const a = row.values[from];
  const b = row.values[to];
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) > 1e-9;
  return a !== b;
};

export function downloadCsv(filename: string, rows: (string | number)[][]): void {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const blob = new Blob([rows.map((r) => r.map(esc).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
