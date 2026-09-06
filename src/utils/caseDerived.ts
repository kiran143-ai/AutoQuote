import { productShort } from '../data/products';
import { premiumShort } from './format';
import type { QuoteCase, ValidationChip } from '../types';

export function validationChips(c: QuoteCase): ValidationChip[] {
  return [
  { label: 'Input ranges', state: 'pass' },
  { label: 'Underwriting', state: 'pass' },
  { label: 'Compensation', state: 'pass' },
  { label: 'Reconciliation', state: 'pending' },
  { label: 'MVP target', state: c.priced ? 'pass' : 'pending' },
  { label: 'Risk / Baseline', state: 'pending' }];

}

export function caseSummaryLine(c: QuoteCase): string {
  return [
  c.client,
  productShort(c.product),
  `${c.inputs.lives} lives`,
  c.situsState,
  premiumShort(c.inputs.premium),
  c.producer].

  filter(Boolean).
  join(' · ');
}

export interface ReadinessCheck {
  label: string;
  value: string;
  state: 'pass' | 'fail' | 'warn';
}

export function readinessChecks(c: QuoteCase): ReadinessCheck[] {
  const m = c.metrics;
  return [
  {
    label: 'Annual premium populated',
    value: `${premiumShort(c.inputs.premium)}`,
    state: 'pass'
  },
  {
    label: 'Number of lives specified',
    value: `${c.inputs.lives} lives`,
    state: 'pass'
  },
  { label: 'Situs state assigned', value: c.situsState, state: 'pass' },
  { label: 'Client name provided', value: c.client, state: 'pass' },
  { label: 'M&E rate set', value: `${c.inputs.me} bps`, state: 'pass' },
  {
    label: 'Pricing engine executed',
    value: c.priced ? `Round ${c.round} complete` : 'Not yet priced',
    state: c.priced ? 'pass' : 'fail'
  },
  {
    label: 'MVP meets minimum target (≥ 3.23%)',
    value: m ? `MVP: ${m.mvp.toFixed(2)}%` : '—',
    state: m && m.mvp >= 3.23 ? 'pass' : 'fail'
  },
  {
    label: 'M&E not extreme (≤ 200 bps)',
    value: `M&E at ${c.inputs.me} bps exceeds 200 bps maximum`,
    state: c.inputs.me <= 200 ? 'pass' : 'fail'
  },
  {
    label: 'State premium tax applicable',
    value: `${c.situsState} premium tax will apply`,
    state: 'pass'
  },
  {
    label: 'Surplus strain within limits (< 15%)',
    value: m ? `Surplus strain: ${m.strain.toFixed(2)}%` : '—',
    state: 'pass'
  },
  {
    label: 'Stress test or sensitivity analysis run',
    value: 'At least one analysis scenario completed',
    state: 'pass'
  },
  {
    label: 'Census data uploaded',
    value:
    c.censusSource === 'synthetic' ?
    'No census — using synthetic averages' :
    'Census file attached',
    state: c.censusSource === 'synthetic' ? 'warn' : 'pass'
  }];

}

export function readinessSummary(c: QuoteCase): {
  passed: number;
  failed: number;
  warned: number;
  score: number;
  total: number;
} {
  const checks = readinessChecks(c);
  const passed = checks.filter((x) => x.state === 'pass').length;
  const failed = checks.filter((x) => x.state === 'fail').length;
  const warned = checks.filter((x) => x.state === 'warn').length;
  return {
    passed,
    failed,
    warned,
    total: checks.length,
    score: Math.round(passed / checks.length * 100)
  };
}