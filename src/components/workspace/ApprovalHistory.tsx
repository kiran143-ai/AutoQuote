import React from 'react';
import { CheckIcon, SendIcon, XIcon } from 'lucide-react';
import { stageLabel, wasReturned } from '../../utils/approvalFlow';
import type { FeedEntry, QuoteCase } from '../../types';

const historyKinds = ['Submitted for Approval', 'Approved', 'Declined'];

const dateOf = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
const timeOf = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

function describe(e: FeedEntry): {title: string;detail: string;tone: 'success' | 'primary' | 'danger';} {
  const flow = e.fromStage && e.toStage ? `${stageLabel[e.fromStage]} to ${stageLabel[e.toStage]}` : null;
  if (e.kind === 'Declined') {
    return {
      title: 'Declined',
      tone: 'danger',
      detail: e.fromStage && e.toStage ? `at ${stageLabel[e.fromStage]}, returned to ${stageLabel[e.toStage]}` : e.detail
    };
  }
  const sent = e.kind === 'Submitted for Approval' || e.fromStage === 'Draft' || e.fromStage === 'Pricing';
  return {
    title: sent ? 'Sent for review' : 'Approved',
    tone: sent ? 'primary' : 'success',
    detail: flow ?? e.detail
  };
}

const tones = {
  success: { badge: 'bg-success-tint text-[#15803D]', text: 'text-[#15803D]', Icon: CheckIcon },
  primary: { badge: 'bg-primary-tint text-primary', text: 'text-primary', Icon: SendIcon },
  danger: { badge: 'bg-danger-tint text-[#B91C1C]', text: 'text-[#B91C1C]', Icon: XIcon }
};

export function ApprovalHistory({ quote }: {quote: QuoteCase;}): JSX.Element {
  const entries = quote.feed.filter((e) => historyKinds.includes(e.kind)).slice().reverse();

  return (
    <section aria-label="Approval history">
      <h3 className="text-micro font-semibold uppercase tracking-[0.06em] text-muted">Approval history</h3>
      {entries.length === 0 ?
      <p className="mt-2 text-[13px] text-muted">No approval activity yet.</p> :

      <ul className="mt-1 divide-y divide-line">
          {entries.map((e) => {
          const d = describe(e);
          const t = tones[d.tone];
          return (
            <li key={e.id} className="flex gap-3 py-3">
                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${t.badge}`}>
                  <t.Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px]">
                    <span className={`font-semibold ${t.text}`}>{d.title}</span>
                    <span className="text-muted"> · {d.detail}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{e.actor}</p>
                  {e.comment &&
                <p className="mt-1.5 rounded-md bg-canvas px-2.5 py-1.5 text-xs text-ink">“{e.comment}”</p>
                }
                </div>
                <div className="shrink-0 text-right text-micro text-muted tnum">
                  <p>{dateOf(e.time)}</p>
                  <p>{timeOf(e.time)}</p>
                </div>
              </li>);

        })}
        </ul>
      }
    </section>);

}

export function DeclineNotice({ quote }: {quote: QuoteCase;}): JSX.Element | null {
  if (!wasReturned(quote)) return null;
  const e = quote.feed.slice().reverse().find((x) => x.kind === 'Declined');
  if (!e) return null;
  return (
    <div role="status" className="mb-4 rounded-md border border-danger/40 bg-danger-tint px-3.5 py-3">
      <p className="text-[13px] font-semibold text-[#B91C1C]">Declined by {e.actor}</p>
      <p className="mt-0.5 text-xs text-muted tnum">{dateOf(e.time)}, {timeOf(e.time)} · returned to {stageLabel[e.toStage ?? 'Pricing']}</p>
      {e.comment && <p className="mt-1.5 text-xs text-ink">“{e.comment}”</p>}
    </div>);

}
