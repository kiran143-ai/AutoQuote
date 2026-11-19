import React, { useMemo, useState } from 'react';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CheckIcon, DownloadIcon, XIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusChip } from '../analytics/StatusChip';
import { changed, diffSections, downloadCsv, keyDeltaRows, rollSteps, type DiffRow } from '../../data/rollForward';

function toneFor(row: DiffRow, delta: number): string {
  if (Math.abs(delta) < 1e-9 || !row.better) return 'text-muted';
  const good = row.better === 'higher' ? delta > 0 : delta < 0;
  return good ? 'text-[#15803D]' : 'text-[#B91C1C]';
}

function deltaText(row: DiffRow, from: number, to: number): {text: string;tone: string;} {
  const a = row.values[from];
  const b = row.values[to];
  if (typeof a !== 'number' || typeof b !== 'number') return { text: a === b ? 'No change' : 'Changed', tone: a === b ? 'text-muted' : 'text-[#92400E]' };
  const d = b - a;
  if (Math.abs(d) < 1e-9) return { text: 'No change', tone: 'text-muted' };
  const pct = a !== 0 ? ` (${d > 0 ? '+' : '−'}${Math.abs(d / a * 100).toFixed(1)}%)` : '';
  const body = row.delta ? row.delta(d) : `${d > 0 ? '+' : '−'}${Math.abs(d).toFixed(2)}`;
  return { text: `${body}${pct}`, tone: toneFor(row, d) };
}

type DeltaState = 'improved' | 'worse' | 'neutral' | 'none';

const stateStyles: Record<DeltaState, {accent: string;bg: string;text: string;word: string;}> = {
  improved: { accent: 'border-t-2 border-t-success', bg: 'bg-white', text: 'text-[#15803D]', word: 'Improved' },
  worse: { accent: 'border-t-2 border-t-danger', bg: 'bg-white', text: 'text-[#B91C1C]', word: 'Worse' },
  neutral: { accent: 'border-t-2 border-t-primary', bg: 'bg-white', text: 'text-primary', word: 'Changed' },
  none: { accent: '', bg: 'bg-canvas/60', text: 'text-muted', word: 'No change' }
};

function stateOf(row: DiffRow, from: number, to: number): {state: DeltaState;sign: number;} {
  const a = row.values[from];
  const b = row.values[to];
  if (typeof a !== 'number' || typeof b !== 'number') return { state: a === b ? 'none' : 'neutral', sign: 0 };
  const d = b - a;
  if (Math.abs(d) < 1e-9) return { state: 'none', sign: 0 };
  if (!row.better) return { state: 'neutral', sign: Math.sign(d) };
  return { state: (row.better === 'higher' ? d > 0 : d < 0) ? 'improved' : 'worse', sign: Math.sign(d) };
}

function DeltaTile({ row, from, to }: {row: DiffRow;from: number;to: number;}): JSX.Element {
  const { state, sign } = stateOf(row, from, to);
  const st = stateStyles[state];
  const d = deltaText(row, from, to);
  return (
    <li className={`rounded-md border border-line px-4 py-3 ${st.bg} ${st.accent}`}>
      <p className="text-xs font-medium text-muted">{row.label}</p>
      <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-sm tnum">
        <span className="text-muted">{row.format(row.values[from])}</span>
        <ArrowRightIcon className="h-3.5 w-3.5 self-center text-muted" strokeWidth={1.75} aria-hidden="true" />
        <span className="text-base font-semibold text-ink">{row.format(row.values[to])}</span>
      </p>
      <p className={`mt-1 flex items-center gap-1 text-xs font-medium tnum ${st.text}`}>
        {sign > 0 && <ArrowUpIcon className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />}
        {sign < 0 && <ArrowDownIcon className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />}
        <span className="sr-only">{st.word}: </span>
        {d.text}
      </p>
    </li>);

}

export function DeepDiffSection({
  from,
  to,
  onClose
}: {from: number;to: number;onClose: () => void;}): JSX.Element {
  const [tab, setTab] = useState('summary');
  const sections = useMemo(() => diffSections().map((s) => ({ ...s, changed: s.rows.some((r) => changed(r, from, to)) })), [from, to]);
  const keyDeltas = useMemo(() => keyDeltaRows(), []);
  const movedDeltas = keyDeltas.filter((r) => stateOf(r, from, to).state !== 'none');
  const sameDeltas = keyDeltas.filter((r) => stateOf(r, from, to).state === 'none');
  const changedCount = sections.filter((s) => s.changed).length;
  const a = rollSteps[from];
  const b = rollSteps[to];
  const active = sections.find((s) => s.id === tab);

  const exportCsv = () =>
  downloadCsv(`deep-diff-step${from}-step${to}.csv`, [
  ['Metric', `Step ${from}: ${a.name}`, `Step ${to}: ${b.name}`, 'Change'],
  ...keyDeltas.map((r) => [r.label, r.format(r.values[from]), r.format(r.values[to]), deltaText(r, from, to).text])]
  );

  return (
    <Card
      accent="primary"
      title={
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          Deep Diff
          <span className="text-[13px] font-medium text-muted">
            Step {from}: {a.name}
          </span>
          <ArrowRightIcon className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" />
          <span className="text-[13px] font-medium text-muted">
            Step {to}: {b.name}
          </span>
        </span>
      }
      action={
      <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" icon={<DownloadIcon className="h-4 w-4" strokeWidth={1.75} />} onClick={exportCsv}>
            Export CSV
          </Button>
          <button
          type="button"
          onClick={onClose}
          aria-label="Close deep diff"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

            <XIcon className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      }>

      <div role="tablist" aria-label="Deep diff sections" className="thin-scroll -mx-1 flex gap-1 overflow-x-auto border-b border-line px-1">
        {[{ id: 'summary', label: 'Summary', changed: false, isSummary: true }, ...sections.map((s) => ({ ...s, isSummary: false }))].map((t) =>
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={tab === t.id}
          onClick={() => setTab(t.id)}
          className={`-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-ink'}`
          }>

            {t.label}
            {!t.isSummary && (t.changed ?
          <>
                  <span className="h-2 w-2 rounded-full bg-warning" aria-hidden="true" />
                  <span className="sr-only">(changed)</span>
                </> :

          <>
                  <CheckIcon className="h-3.5 w-3.5 text-[#15803D]" strokeWidth={2.5} aria-hidden="true" />
                  <span className="sr-only">(no change)</span>
                </>)
          }
          </button>
        )}
      </div>

      <div className="pt-4">
        {tab === 'summary' ?
        <>
            <div className="flex flex-wrap items-center gap-2">
              <p className="mr-1 text-[15px] font-semibold text-ink tnum">
                {changedCount} of {sections.length} sections changed
              </p>
              {sections.map((s) =>
            <button key={s.id} type="button" onClick={() => setTab(s.id)} className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <StatusChip tone={s.changed ? 'warning' : 'success'}>
                    {s.changed ? '' : '✓ '}
                    {s.label}
                    {s.changed ? ' · changed' : ''}
                  </StatusChip>
                </button>
            )}
            </div>

            <h3 className="mb-2 mt-5 text-micro font-semibold uppercase tracking-[0.06em] text-muted">
              Key deltas · {movedDeltas.length} changed
            </h3>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {movedDeltas.map((r) => <DeltaTile key={r.key} row={r} from={from} to={to} />)}
            </ul>
            {sameDeltas.length > 0 &&
            <>
                <h3 className="mb-2 mt-5 text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                  No change · {sameDeltas.length}
                </h3>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {sameDeltas.map((r) => <DeltaTile key={r.key} row={r} from={from} to={to} />)}
                </ul>
              </>
            }
          </> :
        active && active.rows.length > 0 ?
        <div className="thin-scroll overflow-x-auto rounded-md border border-line">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-canvas text-xs font-semibold uppercase tracking-[0.06em] text-muted">
                  <th scope="col" className="px-4 py-2.5 text-left">Field</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Step {from}: {a.name}</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Step {to}: {b.name}</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                {active.rows.map((r) => {
                const isChanged = changed(r, from, to);
                const d = deltaText(r, from, to);
                return (
                  <tr key={r.key} className={`border-b border-line last:border-0 ${isChanged ? 'bg-warning-tint' : ''}`}>
                      <th scope="row" className="px-4 py-2.5 text-left font-medium text-ink">{r.label}</th>
                      <td className="px-4 py-2.5 text-right text-muted tnum">{r.format(r.values[from])}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-ink tnum">{r.format(r.values[to])}</td>
                      <td className={`px-4 py-2.5 text-right text-[13px] font-medium tnum ${d.tone}`}>{d.text}</td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div> :

        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-line bg-canvas px-6 py-10 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success-tint">
              <CheckIcon className="h-5 w-5 text-[#15803D]" strokeWidth={2} aria-hidden="true" />
            </span>
            <p className="text-[15px] font-semibold text-ink">No changes in {active?.label}</p>
            <p className="text-[13px] text-muted">Step {from} and Step {to} are identical for this section.</p>
          </div>
        }
      </div>
    </Card>);

}
