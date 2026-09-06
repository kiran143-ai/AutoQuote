export interface DecompositionComponent {
  key: string;
  label: string;
  color: string;
  total: number;
}

/** 11 components, values in $M, matching the reference case decomposition. */
export const decompositionComponents: DecompositionComponent[] = [
{ key: 'meFees', label: 'M&E Fees', color: '#1D4ED8', total: 47.61 },
{ key: 'coiMargin', label: 'COI Margin', color: '#7C3AED', total: 2.0 },
{ key: 'invIncome', label: 'Inv. Income', color: '#16A34A', total: 137.16 },
{ key: 'commission', label: 'Commission', color: '#0EA5E9', total: -1.91 },
{ key: 'expenses', label: 'Expenses', color: '#F59E0B', total: -2.4 },
{ key: 'claims', label: 'Claims', color: '#DC2626', total: -1.1 },
{ key: 'premTax', label: 'Prem Tax', color: '#EC4899', total: -0.7 },
{ key: 'reinsurance', label: 'Reinsurance', color: '#14B8A6', total: -0.35 },
{ key: 'reservesDelta', label: 'Reserves Δ', color: '#B45309', total: -89.29 },
{ key: 'surplusDelta', label: 'Surplus Δ', color: '#6366F1', total: -6.28 },
{ key: 'tax', label: 'Tax', color: '#64748B', total: -21.13 }];


export const decompositionYears = 31;

/** Deterministic annual allocation of each component across the 31 years. */
export const annualDecomposition = Array.from(
  { length: decompositionYears },
  (_, i) => {
    const year = i + 1;
    const row: Record<string, string | number> = { year: `Yr ${year}` };
    const ramp = Math.min(1, year / 8);
    const decay = 1 / (1 + i * 0.03);
    decompositionComponents.forEach((c, idx) => {
      const weight = ramp * decay * (1 + 0.02 * ((idx + year) % 3));
      const perYear = c.total / decompositionYears * weight * 1.35;
      row[c.key] = Math.round(perYear * 100) / 100;
    });
    return row;
  }
);

export const cumulativeDecomposition = annualDecomposition.map((row, i) => {
  let net = 0;
  for (let j = 0; j <= i; j++) {
    decompositionComponents.forEach((c) => {
      net += annualDecomposition[j][c.key] as number;
    });
  }
  return { year: row.year, net: Math.round(net * 100) / 100 };
});

export const topDrivers = ['invIncome', 'meFees', 'coiMargin'];
export const topDrags = ['reservesDelta', 'tax', 'surplusDelta'];
export const netDecomposition = 66.91;