import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangleIcon, MailIcon, SendIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { MetricTile } from '../ui/MetricTile';
import { useToast } from '../../contexts/ToastContext';
import { nextStage, stageLabel, stageOwnerLabel } from '../../utils/approvalFlow';
import { readinessSummary } from '../../utils/caseDerived';
import { productLabel } from '../../data/products';
import { premiumShort, signedPct } from '../../utils/format';
import { TARGET_MVP } from '../../utils/pricing';
import type { QuoteCase } from '../../types';

const NOTE_LIMIT = 500;

function useDialogBasics(onClose: () => void) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return panel;
}

function Backdrop({ onClose, children }: {onClose: () => void;children: React.ReactNode;}): JSX.Element {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>

      {children}
    </div>);

}

function NoteField({ id, label, value, onChange, placeholder, required = false, rows = 4 }: {id: string;label: string;value: string;onChange: (v: string) => void;placeholder: string;required?: boolean;rows?: number;}): JSX.Element {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs text-muted">
        {label}
        {required && <span className="ml-1 font-semibold text-danger">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        maxLength={NOTE_LIMIT}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-md border border-line bg-white px-3 py-2 text-[13px] text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />

      <p className="mt-1 text-right text-micro text-muted tnum">{value.length} / {NOTE_LIMIT}</p>
    </div>);

}

export function SendForReviewDialog({
  quote,
  onClose,
  onConfirm
}: {quote: QuoteCase;onClose: () => void;onConfirm: (note: string) => void;}): JSX.Element {
  const toast = useToast();
  const panel = useDialogBasics(onClose);
  const [note, setNote] = useState('');
  const summary = readinessSummary(quote);
  const m = quote.metrics;
  const target = quote.approvalStage === 'Pricing' && quote.resumeStage ? quote.resumeStage : nextStage(quote.approvalStage);
  const to = stageOwnerLabel[target];
  const [subject, setSubject] = useState(`[AutoQuote] ${quote.name} (Round ${quote.round}) ready for ${stageLabel[target]}`);
  const link = `${window.location.origin}/quotes/${quote.id}/evidence`;
  const mvpOk = m ? m.mvp >= TARGET_MVP : false;

  return (
    <Backdrop onClose={onClose}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compose-title"
        tabIndex={-1}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-card border border-line bg-white shadow-pop focus:outline-none">

        <div className="flex items-center justify-between border-b border-line bg-canvas px-4 py-2.5">
          <h2 id="compose-title" className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <MailIcon className="h-4 w-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
            New message
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Discard message"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

            <XIcon className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-line px-4 py-2">
          <Button variant="primary" size="sm" onClick={() => onConfirm(note.trim())} icon={<SendIcon className="h-4 w-4" strokeWidth={1.75} />}>
            Send
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>Discard</Button>
        </div>

        <div className="divide-y divide-line border-b border-line text-[13px]">
          <div className="flex items-center gap-3 px-4 py-2">
            <span className="w-14 shrink-0 text-muted">From</span>
            <span className="text-ink">Kiran Yeligeti</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2">
            <span className="w-14 shrink-0 text-muted">To</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-tint py-0.5 pl-0.5 pr-2.5 text-xs font-medium text-primary">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">{to.charAt(0)}</span>
              {to}
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-1.5">
            <label htmlFor="compose-subject" className="w-14 shrink-0 text-muted">Subject</label>
            <input
              id="compose-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-8 w-full border-0 bg-transparent p-0 text-[13px] font-medium text-ink focus:outline-none focus:ring-0" />

          </div>
        </div>

        <div className="thin-scroll flex-1 overflow-y-auto px-5 py-4 text-[13px] text-ink">
          <p>Hello {to},</p>
          <p className="mt-2">
            <span className="font-semibold">{quote.name}</span> (Round {quote.round}) for {quote.client} is ready for your {stageLabel[target].toLowerCase()}. The key metrics are below.
          </p>

          <div className="mt-3">
            <NoteField id="compose-note" label="Personal note (optional)" value={note} onChange={setNote} placeholder={`Add context for the ${to}…`} rows={3} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <MetricTile label="MVP" value={m ? signedPct(m.mvp, 2) : '—'} tone={mvpOk ? 'success' : 'danger'} emphasis />
            <MetricTile label="Strain" value={m ? signedPct(m.strain, 2) : '—'} tone="warning" emphasis />
            <MetricTile label="M&E" value={`${quote.inputs.me} bps`} emphasis />
            <MetricTile label="Premium" value={premiumShort(quote.inputs.premium)} emphasis />
            <MetricTile label="Lives" value={quote.inputs.lives} />
            <MetricTile label="Break-even" value={m ? `Mo ${m.breakEven}` : '—'} />
            <MetricTile label="Round" value={`#${quote.round}`} />
            <MetricTile label="Readiness" value={`${summary.score}%`} hint={`${summary.passed}/${summary.total} checks`} tone={summary.failed ? 'warning' : 'success'} />
          </div>

          <p className="mt-3 text-xs text-muted">{productLabel(quote.product)} · {quote.situsState} · Producer {quote.producer}</p>

          <div className="mt-4 rounded-md border border-line bg-canvas px-4 py-3">
            <p className="text-xs text-muted">Open the full quote workflow, evidence and approval history:</p>
            <a
              href={link}
              onClick={(e) => {
                e.preventDefault();
                toast.info('Link preview', 'Recipients land on this quote’s Evidence tab.');
              }}
              className="mt-2 inline-flex h-9 items-center rounded-md bg-primary px-4 text-[13px] font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">

              View quote workflow
            </a>
            <p className="mt-2 break-all text-micro text-muted tnum">{link}</p>
          </div>

          <p className="mt-4 text-xs text-muted">Kiran Yeligeti<br />NYL AutoQuote Pricing Engine</p>
        </div>
      </div>
    </Backdrop>);

}

export function DeclineDialog({
  quote,
  onClose,
  onConfirm
}: {quote: QuoteCase;onClose: () => void;onConfirm: (comment: string) => void;}): JSX.Element {
  const panel = useDialogBasics(onClose);
  const [comment, setComment] = useState('');

  return (
    <Backdrop onClose={onClose}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="decline-title"
        tabIndex={-1}
        className="w-full max-w-lg rounded-card border border-line bg-white shadow-pop focus:outline-none">

        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger-tint">
              <AlertTriangleIcon className="h-4 w-4 text-danger" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h2 id="decline-title" className="text-[15px] font-semibold text-ink">Decline and return to Actuary</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

            <XIcon className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="text-[13px] text-muted">
            {quote.name} goes back to the Actuary from {stageLabel[quote.approvalStage]} and its status becomes Declined. The Actuary and earlier reviewers are notified with your comments.
          </p>
          <div className="mt-4">
            <NoteField id="decline-comment" label="Comments" required value={comment} onChange={setComment} placeholder="What needs to change before this can be approved?" />
          </div>
        </div>
        <div className="flex justify-end gap-2.5 border-t border-line px-5 py-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" disabled={!comment.trim()} onClick={() => onConfirm(comment.trim())}>
            Decline &amp; return
          </Button>
        </div>
      </div>
    </Backdrop>);

}
