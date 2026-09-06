export function premiumShort(value: number): string {
  if (value >= 1_000_000_000) return `$${trimZero(value / 1_000_000_000)}B`;
  if (value >= 1_000_000) return `$${trimZero(value / 1_000_000)}M`;
  if (value >= 1_000) return `$${trimZero(value / 1_000)}K`;
  return `$${value}`;
}

function trimZero(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function currency(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

export function signedPct(value: number, digits = 2): string {
  const sign = value > 0 ? '' : value < 0 ? '−' : '';
  return `${sign}${Math.abs(value).toFixed(digits)}%`;
}

export function pct(value: number, digits = 2): string {
  return `${value.toFixed(digits)}%`;
}

export function shortDate(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
}

export function relativeFromNow(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const mins = Math.max(1, Math.round((Date.now() - then) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}