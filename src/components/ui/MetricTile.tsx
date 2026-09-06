import React from 'react';
import { twMerge } from 'tailwind-merge';

interface MetricTileProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: 'default' | 'success' | 'danger' | 'warning';
  emphasis?: boolean;
  className?: string;
}

const tones = {
  default: 'text-ink',
  success: 'text-[#15803D]',
  danger: 'text-danger',
  warning: 'text-[#B45309]'
};

export function MetricTile({
  label,
  value,
  hint,
  tone = 'default',
  emphasis = false,
  className
}: MetricTileProps): JSX.Element {
  return (
    <div
      className={twMerge(
        'flex flex-col rounded-md border border-line bg-white px-4 py-3',
        emphasis && 'bg-canvas',
        className
      )}>
      
      <span className="text-micro font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      <span
        className={twMerge(
          'mt-1 font-semibold tnum',
          emphasis ? 'text-2xl' : 'text-lg',
          tones[tone]
        )}>
        
        {value}
      </span>
      {hint &&
      <span className="mt-auto pt-1 text-micro text-muted tnum">{hint}</span>
      }
    </div>);

}