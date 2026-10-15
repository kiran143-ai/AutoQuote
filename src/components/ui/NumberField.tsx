import React from 'react';
import { HelpCircleIcon } from 'lucide-react';

interface NumberFieldProps {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  hint?: string;
  suffix?: string;
  trailing?: React.ReactNode;
  disabled?: boolean;
}

export function NumberField({
  label,
  value,
  onChange,
  hint,
  suffix,
  trailing,
  disabled = false
}: NumberFieldProps): JSX.Element {
  const id = `field-${label.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-1 flex items-center gap-1 text-xs text-muted">
        
        {label}
        {hint &&
        <span title={hint}>
            <HelpCircleIcon
            className="h-3.5 w-3.5 text-muted/70"
            strokeWidth={1.75}
            aria-hidden="true" />
          
          </span>
        }
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            id={id}
            disabled={disabled}
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-full rounded-md border border-line bg-white px-2.5 text-sm font-medium text-ink tnum transition-colors duration-150 ease-out focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-canvas disabled:text-muted" />
          
          {suffix &&
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-micro text-muted">
              {suffix}
            </span>
          }
        </div>
        {trailing}
      </div>
    </div>);

}