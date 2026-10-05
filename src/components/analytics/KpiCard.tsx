import React from 'react';
import { Card } from '../ui/Card';

type Tone = 'default' | 'success' | 'warning' | 'danger';

const valueTones: Record<Tone, string> = {
  default: 'text-ink',
  success: 'text-[#15803D]',
  warning: 'text-[#92400E]',
  danger: 'text-danger'
};

export function KpiCard({
  label,
  value,
  caption,
  tone = 'default',
  unavailable = false
}: {
  label: string;
  value: string;
  caption: string;
  tone?: Tone;
  unavailable?: boolean;
}): JSX.Element {
  return (
    <Card accent="primary">
      <p className="text-micro font-semibold uppercase tracking-[0.06em] text-muted">{label}</p>
      <p
        className={`mt-2 font-bold tnum ${
        unavailable ? 'text-lg text-muted' : `text-[28px] leading-8 ${valueTones[tone]}`}`
        }>

        {value}
      </p>
      <p className="mt-1.5 text-xs text-muted">{caption}</p>
    </Card>);

}
