import React, { useMemo, useState } from 'react';
import { XIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { incomeStatement, money, rollSteps } from '../../data/rollForward';

export function IncomeStatementPanel({ step, onClose }: {step: number;onClose: () => void;}): JSX.Element {
  const [showAll, setShowAll] = useState(false);
  const lines = useMemo(() => incomeStatement(step), [step]);
  const years = showAll ? 39 : 10;
  const s = rollSteps[step];

  return (
    <section aria-label="Income statement" className="mt-5 rounded-card border border-line bg-canvas/50">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">Income Statement · Step {step}: {s.name}</h3>
          <p className="mt-0.5 text-xs text-muted tnum">Showing {years} of 39 projection years</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowAll((v) => !v)} aria-pressed={showAll}>
            {showAll ? 'Show first 10' : 'Show all 39'}
          </Button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close income statement"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

            <XIcon className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <div className="thin-scroll max-h-[520px] overflow-auto bg-white">
        <table className="w-full min-w-[900px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 top-0 z-20 border-b border-line bg-white px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.06em] text-muted">
                Line item
              </th>
              {Array.from({ length: years }, (_, i) =>
              <th key={i} scope="col" className="sticky top-0 z-10 whitespace-nowrap border-b border-line bg-white px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-[0.06em] text-muted tnum">
                  Yr {i + 1}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {lines.map((line) =>
            <tr key={line.label} className={line.bold ? 'bg-canvas/70' : ''}>
                <th
                scope="row"
                className={`sticky left-0 z-10 whitespace-nowrap border-b border-line px-4 py-2 text-left ${line.bold ? 'bg-[#F6F7F8] font-semibold text-ink' : 'bg-white font-normal text-ink'}`}>

                  {line.label}
                </th>
                {line.values.slice(0, years).map((v, i) =>
              <td
                key={i}
                className={`whitespace-nowrap border-b border-line px-3 py-2 text-right tnum ${v < 0 ? 'text-[#B91C1C]' : 'text-ink'} ${line.bold ? 'font-semibold' : ''}`}>

                    {money(v)}
                  </td>
              )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>);

}
