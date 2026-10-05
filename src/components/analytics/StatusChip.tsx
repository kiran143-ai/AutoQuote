import React from 'react';

type Tone = 'success' | 'warning' | 'danger' | 'neutral';

const tones: Record<Tone, string> = {
  success: 'bg-success-tint text-[#15803D] border-success/40',
  warning: 'bg-warning-tint text-[#92400E] border-warning/40',
  danger: 'bg-danger-tint text-[#B91C1C] border-danger/40',
  neutral: 'bg-canvas text-muted border-line'
};

export function StatusChip({ tone, children }: {tone: Tone;children: React.ReactNode;}): JSX.Element {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-micro font-semibold uppercase tracking-[0.04em] ${tones[tone]}`}>
      {children}
    </span>);

}
