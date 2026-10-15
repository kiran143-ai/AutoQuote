import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ToastViewport } from '../components/ui/Toast';

export type ToastTone = 'success' | 'info' | 'warning' | 'danger';

export interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
  action?: ToastAction;
}

export interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastApi {
  success: (title: string, description?: string, action?: ToastAction) => void;
  info: (title: string, description?: string, action?: ToastAction) => void;
  warning: (title: string, description?: string, action?: ToastAction) => void;
  danger: (title: string, description?: string, action?: ToastAction) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const MAX_VISIBLE = 3;
let nextId = 1;

export function ToastProvider({ children }: {children: React.ReactNode;}): JSX.Element {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((tone: ToastTone, title: string, description?: string, action?: ToastAction) => {
    setToasts((prev) => [...prev, { id: nextId++, tone, title, description, action }].slice(-MAX_VISIBLE));
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (t, d, a) => push('success', t, d, a),
      info: (t, d, a) => push('info', t, d, a),
      warning: (t, d, a) => push('warning', t, d, a),
      danger: (t, d, a) => push('danger', t, d, a)
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
