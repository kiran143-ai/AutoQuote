import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDownIcon, DownloadIcon, GitCompareIcon, RefreshCwIcon, RotateCcwIcon, ZapIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusChip } from '../analytics/StatusChip';
import { IncomeStatementPanel } from './IncomeStatementPanel';
import { DeepDiffSection } from './DeepDiffSection';
import { useToast } from '../../contexts/ToastContext';
import {
  changed,
  downloadCsv,
  groupLabels,
  inputRows,
  iterations,
  metricRows,
  rawRows,
  rollSteps,
  type DiffRow } from
'../../data/rollForward';

type Tab = 'financials' | 'parameters';

const FIRST = 0;
const LAST = rollSteps.length - 1;

function colTint(i: number): string {
  if (i === FIRST) return 'bg-canvas/70';
  if (i === LAST) return 'bg-success-tint/70';
  return 'bg-white';
}

const isGroupStart = (i: number) => i > 0 && rollSteps[i].group !== rollSteps[i - 1].group;

function stepGroups(): {group: number;span: number;from: number;to: number;}[] {
  const out: {group: number;span: number;from: number;to: number;}[] = [];
  rollSteps.forEach((s, i) => {
    const prev = out[out.length - 1];
    if (prev && prev.group === s.group) {
      prev.span += 1;
      prev.to = i;
    } else out.push({ group: s.group, span: 1, from: i, to: i });
  });
  return out;
}

function deltaOf(row: DiffRow, i: number): {text: string;tone: string;} | null {
  if (i === 0 || !row.delta) return null;
  const a = row.values[i - 1];
  const b = row.values[i];
  if (typeof a !== 'number' || typeof b !== 'number') return null;
  const d = b - a;
  if (Math.abs(d) < 1e-9) return null;
  const tone = !row.better ? 'text-primary' : (row.better === 'higher' ? d > 0 : d < 0) ? 'text-[#15803D]' : 'text-[#B91C1C]';
  return { text: row.delta(d), tone };
}

export function RollForwardSection(): JSX.Element {
  const toast = useToast();
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<Tab>('financials');
  const [showRaw, setShowRaw] = useState(false);
  const [incomeStep, setIncomeStep] = useState<number | null>(null);
  const [diff, setDiff] = useState<{from: number;to: number;} | null>(null);
  const diffAnchor = useRef<HTMLDivElement>(null);

  const groups = useMemo(stepGroups, []);
  const rows = tab === 'financials' ? showRaw ? [...metricRows, ...rawRows] : metricRows : inputRows;
  const fieldsChanged = inputRows.filter((r) => r.key !== 'product' && changed(r, FIRST, LAST)).length;

  useEffect(() => {
    if (diff) diffAnchor.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [diff]);

  const openDiff = (from: number, to: number) => setDiff({ from, to });

  const exportTable = () => {
    downloadCsv('roll-forward-r1-r2.csv', [
    ['Metric', ...rollSteps.map((s) => `Step ${s.index}: ${s.name}`)],
    ...rows.map((r) => [r.label, ...r.values.map((v) => r.format(v))])]
    );
    toast.success('CSV exported', 'Roll-forward table downloaded.');
  };

  return (
    <>
      <Card
        accent="primary"
        padded={false}
        title={
        <span className="flex items-center gap-2">
            <RefreshCwIcon className="h-4 w-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
            Roll Forward · Round 1 → 2
          </span>
        }
        meta={`${iterations.length} iterations · 2 periods`}
        action={
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Collapse roll forward' : 'Expand roll forward'}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

            <ChevronDownIcon className={`h-4 w-4 transition-transform duration-150 ${open ? '' : '-rotate-90'}`} strokeWidth={1.75} />
          </button>
        }>

        {open &&
        <div className="px-5 pb-5 pt-4">
            {/* Period + provenance */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-md border border-line bg-canvas px-4 py-3">
              <div className="flex items-center gap-2">
                <label htmlFor="roll-period" className="text-[13px] font-medium text-muted">Period</label>
                <select
                id="roll-period"
                defaultValue="r1r2"
                className="h-9 rounded-md border border-line bg-white px-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

                  <option value="r1r2">R1 → R2 ({rollSteps.length} steps)</option>
                </select>
              </div>
              <p className="text-[13px] text-muted tnum">
                Generated <span className="text-ink">11/18/2026, 4:02 AM</span> by Sandeep Chandila · {rollSteps.length} steps · {fieldsChanged} fields changed
              </p>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <StatusChip tone="neutral">
                  <ZapIcon className="mr-1 h-3 w-3" strokeWidth={2} aria-hidden="true" />
                  API
                </StatusChip>
                <Button size="sm" variant="secondary" icon={<RotateCcwIcon className="h-3.5 w-3.5" strokeWidth={1.75} />} onClick={() => toast.info('Reloaded', 'Roll-forward data is up to date.')}>
                  Reload
                </Button>
                <Button size="sm" variant="secondary" icon={<RefreshCwIcon className="h-3.5 w-3.5" strokeWidth={1.75} />} onClick={() => toast.success('Regenerated', 'Roll-forward recalculated from Round 1.')}>
                  Regenerate
                </Button>
                <Button size="sm" variant="secondary" icon={<DownloadIcon className="h-3.5 w-3.5" strokeWidth={1.75} />} onClick={exportTable}>
                  CSV
                </Button>
              </div>
            </div>

            {/* Iteration chain */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">{iterations.length} iterations in chain</span>
              {iterations.map((it) =>
            <span
              key={it.label}
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tnum ${
              it.tone === 'primary' ? 'border-primary/30 bg-primary-tint text-primary' : 'border-success/40 bg-success-tint text-[#15803D]'}`
              }>

                  {it.label} · steps {it.from}–{it.to}
                </span>
            )}
            </div>

            {/* Tabs + view actions */}
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-b border-line">
              <div role="tablist" aria-label="Roll forward views" className="flex gap-1">
                {([['financials', 'Financials'], ['parameters', 'Parameters']] as [Tab, string][]).map(([id, label]) =>
              <button
                key={id}
                role="tab"
                type="button"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`-mb-px border-b-2 px-3.5 py-2.5 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                tab === id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-ink'}`
                }>

                    {label}
                  </button>
              )}
              </div>
              <div className="mb-2 flex items-center gap-2">
                {tab === 'financials' &&
              <Button size="sm" variant="outline" aria-pressed={showRaw} onClick={() => setShowRaw((v) => !v)} className={showRaw ? 'bg-primary-tint' : ''}>
                    {showRaw ? 'Hide raw metrics' : 'Show raw metrics'}
                  </Button>
              }
                <Button
                size="sm"
                variant="primary"
                aria-pressed={diff !== null}
                icon={<GitCompareIcon className="h-4 w-4" strokeWidth={1.75} />}
                onClick={() => diff ? setDiff(null) : openDiff(FIRST, LAST)}>

                  Deep Diff
                </Button>
              </div>
            </div>

            {/* Step table */}
            <div className="thin-scroll mt-4 overflow-x-auto rounded-md border border-line">
              <table className="w-full min-w-[880px] border-separate border-spacing-0 text-sm">
                <colgroup>
                  <col style={{ width: 200 }} />
                  {rollSteps.map((s) => <col key={s.index} />)}
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col" rowSpan={2} className="sticky left-0 z-10 border-b border-line bg-white px-4 py-3 text-left align-bottom text-xs font-semibold uppercase tracking-[0.06em] text-muted">
                      {tab === 'financials' ? 'Metric' : 'Parameter'}
                    </th>
                    {groups.map((g) =>
                  <th
                    key={g.group}
                    scope="colgroup"
                    colSpan={g.span}
                    className={`border-b border-l border-line px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.06em] ${
                    g.group === 0 ? 'bg-canvas text-muted' : 'bg-primary-tint text-primary'}`
                    }>

                        {groupLabels[g.group]}
                        {g.group > 0 && <span className="ml-1.5 font-medium normal-case tracking-normal text-muted tnum">· steps {rollSteps[g.from].index}–{rollSteps[g.to].index}</span>}
                      </th>
                  )}
                  </tr>
                  <tr>
                    {rollSteps.map((s, i) =>
                  <th
                    key={s.index}
                    scope="col"
                    className={`border-b border-l border-line px-3 py-3 text-center align-top font-normal ${colTint(i)} ${isGroupStart(i) ? 'border-l-2 border-l-primary/40' : ''}`}>

                        <span className="flex flex-col items-center gap-1">
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold tnum ${i === LAST ? 'bg-[#15803D] text-white' : i === FIRST ? 'bg-muted text-white' : 'bg-primary text-white'}`}>
                            {s.index}
                          </span>
                          <span className="text-[13px] font-semibold text-ink">{s.name}</span>
                          <span className="text-xs text-muted">{i === LAST ? 'Latest result' : s.kind}</span>
                          {s.change &&
                      <span className="mt-0.5 inline-flex items-center rounded-md border border-warning/40 bg-warning-tint px-2 py-0.5 text-xs font-medium text-[#92400E] tnum">
                              {s.change.label} {s.change.from} → {s.change.to}
                            </span>
                      }
                        </span>
                      </th>
                  )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) =>
                <tr key={r.key}>
                      <th
                    scope="row"
                    className={`sticky left-0 z-10 border-b border-line px-4 py-2.5 text-left ${r.strong ? 'bg-primary-tint font-semibold text-ink' : 'bg-white font-medium text-ink'}`}>

                        {r.label}
                      </th>
                      {r.values.map((v, i) => {
                    const d = deltaOf(r, i);
                    return (
                      <td
                        key={i}
                        className={`border-b border-l border-line px-4 py-2.5 text-right tnum ${r.strong ? 'bg-primary-tint/50' : colTint(i)} ${isGroupStart(i) ? 'border-l-2 border-l-primary/40' : ''}`}>

                            <span className={`block text-sm ${r.strong ? 'font-semibold' : ''} text-ink`}>{r.format(v)}</span>
                            {d && <span className={`block text-xs font-medium ${d.tone}`}>{d.text}</span>}
                          </td>);

                  })}
                    </tr>
                )}

                  {tab === 'financials' &&
                <>
                      <tr>
                        <th scope="row" className="sticky left-0 z-10 border-b border-line bg-white px-4 py-3 text-left font-medium text-ink">
                          <span className="flex items-center gap-1.5">
                            <GitCompareIcon className="h-4 w-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
                            Step diff
                          </span>
                        </th>
                        {rollSteps.map((s, i) =>
                    <td key={s.index} className={`border-b border-l border-line px-3 py-2.5 text-center ${colTint(i)} ${isGroupStart(i) ? 'border-l-2 border-l-primary/40' : ''}`}>
                            {i === 0 ?
                      <span className="text-muted" aria-label="No previous step">—</span> :

                      <Button
                        size="sm"
                        variant="outline"
                        aria-pressed={diff?.from === i - 1 && diff?.to === i}
                        className={diff?.from === i - 1 && diff?.to === i ? 'bg-primary-tint' : ''}
                        onClick={() => openDiff(i - 1, i)}>

                                {i - 1} → {i}
                              </Button>
                      }
                          </td>
                    )}
                      </tr>
                      <tr>
                        <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-3 text-left font-medium text-ink">Income statement</th>
                        {rollSteps.map((s, i) =>
                    <td key={s.index} className={`border-l border-line px-3 py-2.5 text-center ${colTint(i)} ${isGroupStart(i) ? 'border-l-2 border-l-primary/40' : ''}`}>
                            <Button
                        size="sm"
                        variant={incomeStep === i ? 'primary' : 'secondary'}
                        aria-expanded={incomeStep === i}
                        onClick={() => setIncomeStep(incomeStep === i ? null : i)}>

                              {incomeStep === i ? 'Close' : 'View'}
                            </Button>
                          </td>
                    )}
                      </tr>
                    </>
                }
                </tbody>
              </table>
            </div>

            {incomeStep !== null && tab === 'financials' && <IncomeStatementPanel step={incomeStep} onClose={() => setIncomeStep(null)} />}
          </div>
        }
      </Card>

      {diff &&
      <div ref={diffAnchor}>
          <DeepDiffSection key={`${diff.from}-${diff.to}`} from={diff.from} to={diff.to} onClose={() => setDiff(null)} />
        </div>
      }
    </>);

}
