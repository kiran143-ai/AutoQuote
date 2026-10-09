import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ToastViewport } from '../components/ui/Toast';

export type ToastTone = 'success' | 'info' | 'warning' | 'danger';

export interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastApi {
  success: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  danger: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const MAX_VISIBLE = 3;
let nextId = 1;

export function ToastProvider({ children }: {children: React.ReactNode;}): JSX.Element {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((tone: ToastTone, title: string, description?: string) => {
    setToasts((prev) => [...prev, { id: nextId++, tone, title, description }].slice(-MAX_VISIBLE));
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (t, d) => push('success', t, d),
      info: (t, d) => push('info', t, d),
      warning: (t, d) => push('warning', t, d),
      danger: (t, d) => push('danger', t, d)
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>);

}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
