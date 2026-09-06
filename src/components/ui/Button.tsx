import React from 'react';
import { twMerge } from 'tailwind-merge';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
  'bg-primary text-white border border-primary hover:bg-primary-hover hover:border-primary-hover',
  secondary:
  'bg-white text-ink border border-line hover:bg-canvas hover:border-[#d5d9df]',
  ghost: 'bg-transparent text-primary border border-transparent hover:bg-primary-tint',
  danger:
  'bg-white text-danger border border-line hover:bg-danger-tint hover:border-danger/40'
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-9 px-4 text-sm gap-2'
};

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  className,
  children,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      type={rest.type ?? 'button'}
      className={twMerge(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}>
      
      {icon}
      {children}
    </button>);

}