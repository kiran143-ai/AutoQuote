import type { CaseInputs, PricingMetrics } from '../types';

/**
 * Deterministic stand-in for the pricing engine. Calibrated so that the
 * reference case inputs (M&E 300 bps, $5M premium, 7 pay years) reproduce the
 * governed reference results exactly: MVP 3.25%, Break-even Mo 197,
 * Strain −109.2%, Commission $1,905,045, Risk-Adj MVP 3.21%.
 */
export function runPricingEngine(inputs: CaseInputs): PricingMetrics {
  const meRatio = inputs.me / 300;
  const payRatio = inputs.payYears / 7;
  const premiumRatio = inputs.premium / 5_000_000;

  const mvp = round(3.25 * meRatio * (0.85 + 0.15 * payRatio), 2);
  const breakEven = Math.max(1, Math.round(197 / Math.max(0.2, meRatio)));
  const strain = round(-109.2 * (0.6 + 0.4 * premiumRatio), 2);
  const commission = Math.round(
    inputs.premium * inputs.commissionY1 * 5.442986 * payRatio
  );
  const riskAdjMvp = round(mvp - 0.04, 2);

  return {
    mvp,
    breakEven,
    strain,
    commission,
    riskAdjMvp,
    calibratedMe: inputs.me
  };
}

function round(value: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export const TARGET_MVP = 3.23;
export const CALIBRATOR_TARGET_MVP = 3.22;