import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  title?: React.ReactNode;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  accent?: 'none' | 'primary' | 'warning' | 'danger';
  padded?: boolean;
  className?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
}

const accents: Record<NonNullable<CardProps['accent']>, string> = {
  none: '',
  primary: 'border-t-2 border-t-primary',
  warning: 'border-t-2 border-t-warning',
  danger: 'border-t-2 border-t-danger'
};

export function Card({
  title,
  meta,
  action,
  accent = 'none',
  padded = true,
  className,
  bodyClassName,
  children
}: CardProps): JSX.Element {
  return (
    <section
      className={twMerge(
        'rounded-card border border-line bg-white shadow-card',
        accents[accent],
        className
      )}>
      
      {(title || action) &&
      <header className="flex items-start justify-between gap-4 px-5 pt-4">
          <div className="min-w-0">
            {title &&
          <h2 className="text-[15px] font-semibold leading-5 text-ink">
                {title}
              </h2>
          }
            {meta &&
          <p className="mt-0.5 text-xs text-muted tnum">{meta}</p>
          }
          </div>
          {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
        </header>
      }
      <div
        className={twMerge(
          padded ? 'px-5 pb-5' : '',
          title || action ? 'pt-4' : padded ? 'pt-5' : '',
          bodyClassName
        )}>
        
        {children}
      </div>
    </section>);

}