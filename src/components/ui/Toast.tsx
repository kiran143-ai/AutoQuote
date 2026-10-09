import React, { useEffect, useState } from 'react';
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XCircleIcon, XIcon } from 'lucide-react';
import type { ToastItem, ToastTone } from '../../contexts/ToastContext';

export const toastTones: Record<ToastTone, {accent: string;badge: string;icon: React.ElementType;duration: number;}> = {
  success: { accent: 'border-l-success', badge: 'bg-success-tint text-[#15803D]', icon: CheckCircle2Icon, duration: 2500 },
  info: { accent: 'border-l-primary', badge: 'bg-primary-tint text-primary', icon: InfoIcon, duration: 2500 },
  warning: { accent: 'border-l-warning', badge: 'bg-warning-tint text-[#92400E]', icon: AlertTriangleIcon, duration: 3000 },
  danger: { accent: 'border-l-danger', badge: 'bg-danger-tint text-[#B91C1C]', icon: XCircleIcon, duration: 3000 }
};

function Toast({ toast, onDismiss }: {toast: ToastItem;onDismiss: (id: number) => void;}): JSX.Element {
  const [paused, setPaused] = useState(false);
  const { accent, badge, icon: Icon, duration } = toastTones[toast.tone];

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => onDismiss(toast.id), duration);
    return () => window.clearTimeout(timer);
  }, [paused, duration, toast.id, onDismiss]);

  return (
    <div
      role={toast.tone === 'danger' || toast.tone === 'warning' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`toast-in pointer-events-auto flex items-start gap-3 rounded-card border border-l-4 border-line bg-white p-3.5 shadow-pop ${accent}`}>

      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${badge}`}>
        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-ink">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-xs text-muted">{toast.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

        <XIcon className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>);

}

export function ToastViewport({
  toasts,
  onDismiss
}: {toasts: ToastItem[];onDismiss: (id: number) => void;}): JSX.Element {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex w-[360px] max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-col gap-2">

      {toasts.map((t) =>
      <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      )}
    </div>);

}
