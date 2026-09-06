import React from 'react';
import { CheckIcon, MinusIcon } from 'lucide-react';

export function CheckChip({
  label,
  state



}: {label: string;state: 'pass' | 'pending';}): JSX.Element {
  const passed = state === 'pass';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${
      passed ?
      'border-success/40 bg-success-tint text-[#15803D]' :
      'border-line bg-canvas text-muted'}`
      }>
      
      {passed ?
      <CheckIcon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> :

      <MinusIcon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      }
      {label}
    </span>);

}