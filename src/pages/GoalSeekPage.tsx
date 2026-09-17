import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ActivityIcon,
  AlertTriangleIcon,
  Building2Icon,
  ChevronLeftIcon,
  InfoIcon,
  LayoutGridIcon,
  ListFilterIcon,
  LockIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
  SaveIcon,
  TargetIcon,
  TrendingUpIcon,
  XCircleIcon,
  XIcon } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface Tool {
  id: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{className?: string;strokeWidth?: number;'aria-hidden'?: boolean;}>;
}

const toolGroups: {label: string;tools: Tool[];}[] = [
{
  label: 'Solve for a value',
  tools: [
  { id: 'multi-objective', label: 'Multi-Objective', hint: 'One variable, several constraints', icon: TargetIcon },
  { id: 'breakeven-minimum', label: 'Breakeven Minimum', hint: 'Earliest breakeven year', icon: TrendingUpIcon },
  { id: 'funding-optimizer', label: 'Funding Optimizer', hint: 'Premium pattern for a target', icon: LockIcon },
  { id: 'mec-boundary', label: 'MEC Boundary', hint: 'Maximum non-MEC premium', icon: XCircleIcon },
  { id: 'rate-arbitrage', label: 'Rate Arbitrage', hint: 'Spread vs. crediting advantage', icon: TrendingUpIcon }]

},
{
  label: 'Explore behaviour',
  tools: [
  { id: 'sensitivity', label: 'Sensitivity', hint: 'One variable at a time', icon: ActivityIcon },
  { id: 'pbme-tornado', label: 'PBME Tornado', hint: 'Ranked driver impact', icon: ListFilterIcon }]

},
{
  label: 'Compare options',
  tools: [
  { id: 'product-selector', label: 'Product Selector', hint: 'Best fit across products', icon: LayoutGridIcon },
  { id: 'portfolio-seek', label: 'Portfolio Seek', hint: 'Across a book of cases', icon: Building2Icon }]

}];


const totalTools = toolGroups.reduce((sum, g) => sum + g.tools.length, 0);

const metricOptions = ['CVIRR', 'Breakeven year', 'MVP', 'Strain'];
const operatorOptions = ['≥', '≤', '='];

interface Constraint {
  metric: string;
  atYear: string;
  operator: string;
  target: string;
  unit: string;
}

const initialConstraints: Constraint[] = [
{ metric: 'CVIRR', atYear: '10', operator: '≥', target: '3', unit: '%' },
{ metric: 'CVIRR', atYear: '20', operator: '≥', target: '5', unit: '%' },
{ metric: 'Breakeven year', atYear: '', operator: '≤', target: '12', unit: 'yr' }];


const MAX_CONSTRAINTS = 6;

function StepBadge({ n }: {n: number;}): JSX.Element {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white tnum">
      {n}
    </span>);

}

export function GoalSeekPage(): JSX.Element {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState('multi-objective');
  const [variable, setVariable] = useState('Annual Premium');
  const [rangeFrom, setRangeFrom] = useState('1000');
  const [rangeTo, setRangeTo] = useState('100000000');
  const [tolerance, setTolerance] = useState('1000');
  const [constraints, setConstraints] = useState<Constraint[]>(initialConstraints);

  const updateConstraint = (index: number, patch: Partial<Constraint>) => {
    setConstraints((prev) => prev.map((c, i) => i === index ? { ...c, ...patch } : c));
  };

  const removeConstraint = (index: number) => {
    setConstraints((prev) => prev.filter((_, i) => i !== index));
  };

  const addConstraint = () => {
    if (constraints.length >= MAX_CONSTRAINTS) return;
    setConstraints((prev) => [...prev, { metric: 'CVIRR', atYear: '', operator: '≥', target: '', unit: '%' }]);
  };

  return (
    <div className="mx-auto max-w-[1440px] p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-3 -ml-3"
        icon={<ChevronLeftIcon className="h-4 w-4" strokeWidth={1.75} />}>
        Back to Quote Form
      </Button>

      <Card accent="primary" className="mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-muted">
            <span className="font-semibold uppercase tracking-[0.06em] text-muted">Solving on</span>{' '}
            <span className="font-bold text-primary">CEPPVUL4</span> · Age 45 · 1,000 lives · $15,000/yr
          </p>
          <select
            defaultValue="Ad-hoc defaults"
            className="h-9 rounded-md border border-line bg-white px-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

            <option>Ad-hoc defaults</option>
            <option>Case defaults</option>
            <option>Governance defaults</option>
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Card
          accent="primary"
          title={
          <span className="flex items-center gap-2">
              Tools
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-tint px-1.5 text-[11px] font-semibold text-primary tnum">
                {totalTools}
              </span>
            </span>
          }>

          <div className="space-y-5">
            {toolGroups.map((group) =>
            <div key={group.label}>
                <p className="mb-2 text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.tools.map((tool) => {
                  const active = activeTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => setActiveTool(tool.id)}
                      aria-pressed={active}
                      className={`flex w-full items-start gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      active ?
                      'border-primary bg-primary-tint' :
                      'border-transparent hover:bg-canvas'}`
                      }>

                        <tool.icon
                        className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-primary' : 'text-muted'}`}
                        strokeWidth={1.75}
                        aria-hidden />

                        <span className="min-w-0">
                          <span
                          className={`block text-[13px] font-semibold ${active ? 'text-primary' : 'text-ink'}`}>

                            {tool.label}
                          </span>
                          <span className="block text-micro text-muted">{tool.hint}</span>
                        </span>
                      </button>);

                })}
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-5">
          <Card accent="primary">
            <h2 className="text-lg font-bold text-ink">Multi-Objective Goal Seek</h2>
            <p className="mt-2 text-[13px] leading-5 text-muted">
              Finds the single value of one variable that satisfies every constraint. With more
              constraints than variables the system is over-determined — a value satisfying all of
              them may not exist, so the solver reports the binding constraint rather than failing
              silently.{' '}
              <InfoIcon
                className="inline h-3.5 w-3.5 text-primary"
                strokeWidth={1.75}
                aria-hidden />

            </p>
          </Card>

          <Card
            accent="primary"
            title={
            <span className="flex items-center gap-2">
                <StepBadge n={1} />
                Solve for
              </span>
            }>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col">
                <label htmlFor="solve-variable" className="mb-1 text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                  Variable
                </label>
                <select
                  id="solve-variable"
                  value={variable}
                  onChange={(e) => setVariable(e.target.value)}
                  className="h-9 rounded-md border border-line bg-white px-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

                  <option>Annual Premium</option>
                  <option>Pay Years</option>
                  <option>M&amp;E (bps)</option>
                  <option>FA Spread (bps)</option>
                </select>
              </div>

              <div className="flex flex-col">
                <span className="mb-1 text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                  Current value
                </span>
                <span className="text-lg font-bold text-ink tnum">$15,000</span>
                <span className="mt-0.5 text-micro text-muted">from case as configured</span>
              </div>

              <div className="flex flex-col">
                <label htmlFor="range-from" className="mb-1 text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                  Search range
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-muted">$</span>
                    <input
                      id="range-from"
                      inputMode="decimal"
                      value={rangeFrom}
                      onChange={(e) => setRangeFrom(e.target.value)}
                      className="h-9 w-full rounded-md border border-line bg-white pl-5 pr-2 text-sm text-ink tnum focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />

                  </div>
                  <span className="shrink-0 text-micro text-muted">to</span>
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-muted">$</span>
                    <input
                      inputMode="decimal"
                      value={rangeTo}
                      onChange={(e) => setRangeTo(e.target.value)}
                      className="h-9 w-full rounded-md border border-line bg-white pl-5 pr-2 text-sm text-ink tnum focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />

                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="tolerance" className="mb-1 text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                  Tolerance
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-muted">$</span>
                  <input
                    id="tolerance"
                    inputMode="decimal"
                    value={tolerance}
                    onChange={(e) => setTolerance(e.target.value)}
                    className="h-9 w-full rounded-md border border-line bg-white pl-5 pr-2 text-sm text-ink tnum focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />

                </div>
              </div>
            </div>
          </Card>

          <Card
            accent="primary"
            title={
            <span className="flex items-center gap-2">
                <StepBadge n={2} />
                Constraints
                <span className="text-muted font-normal">
                  {constraints.length} of {MAX_CONSTRAINTS} max
                </span>
              </span>
            }>

            <div className="hidden gap-3 px-1 pb-2 text-micro font-semibold uppercase tracking-[0.06em] text-muted sm:grid sm:grid-cols-[minmax(0,1fr)_100px_110px_140px_32px]">
              <span>Metric</span>
              <span>At year</span>
              <span>Operator</span>
              <span>Target</span>
              <span />
            </div>

            <div className="space-y-2">
              {constraints.map((c, i) =>
              <div
                key={i}
                className="grid grid-cols-1 items-center gap-2 rounded-md border border-line px-2 py-2 sm:grid-cols-[minmax(0,1fr)_100px_110px_140px_32px]">

                  <select
                  value={c.metric}
                  onChange={(e) => updateConstraint(i, { metric: e.target.value })}
                  className="h-9 rounded-md border border-line bg-white px-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

                    {metricOptions.map((m) =>
                  <option key={m} value={m}>
                        {m}
                      </option>
                  )}
                  </select>
                  <input
                  inputMode="decimal"
                  placeholder={c.metric === 'Breakeven year' ? 'n/a' : ''}
                  disabled={c.metric === 'Breakeven year'}
                  value={c.atYear}
                  onChange={(e) => updateConstraint(i, { atYear: e.target.value })}
                  className="h-9 rounded-md border border-line bg-white px-2.5 text-sm text-ink tnum focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-canvas disabled:text-muted" />

                  <select
                  value={c.operator}
                  onChange={(e) => updateConstraint(i, { operator: e.target.value })}
                  className="h-9 rounded-md border border-line bg-white px-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

                    {operatorOptions.map((op) =>
                  <option key={op} value={op}>
                        {op}
                      </option>
                  )}
                  </select>
                  <div className="relative">
                    <input
                    inputMode="decimal"
                    value={c.target}
                    onChange={(e) => updateConstraint(i, { target: e.target.value })}
                    className="h-9 w-full rounded-md border border-line bg-white px-2.5 pr-7 text-sm text-ink tnum focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />

                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-micro text-muted">
                      {c.unit}
                    </span>
                  </div>
                  <button
                  type="button"
                  onClick={() => removeConstraint(i)}
                  aria-label="Remove constraint"
                  className="flex h-8 w-8 items-center justify-center justify-self-start rounded-md text-danger transition-colors duration-150 ease-out hover:bg-danger-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">

                    <XIcon className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={addConstraint}
              disabled={constraints.length >= MAX_CONSTRAINTS}
              className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-colors duration-150 ease-out hover:underline disabled:cursor-not-allowed disabled:opacity-50">

              <PlusIcon className="h-4 w-4" strokeWidth={1.75} />
              Add constraint
            </button>

            <div
              role="status"
              className="mt-4 flex items-start gap-2.5 rounded-md border border-warning/40 bg-warning-tint px-3.5 py-3 text-[13px] text-[#92400E]">

              <AlertTriangleIcon
                className="mt-0.5 h-4 w-4 shrink-0"
                strokeWidth={1.75}
                aria-hidden />

              <p>
                <span className="font-semibold">Pre-check: constraints pull in opposite directions.</span>{' '}
                A higher premium raises year-20 CVIRR but delays breakeven. A feasible value may not
                exist across the full search range — the solver will return the closest point and
                name the binding constraint.
              </p>
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3">
              <Button variant="primary" icon={<PlayIcon className="h-4 w-4" strokeWidth={1.75} />}>
                Solve
              </Button>
              <Button variant="secondary" icon={<RotateCcwIcon className="h-4 w-4" strokeWidth={1.75} />}>
                Reset
              </Button>
              <Button variant="outline" icon={<SaveIcon className="h-4 w-4" strokeWidth={1.75} />}>
                Save as preset
              </Button>
            </div>
            <p className="text-right text-micro text-muted">
              Estimated up to 17 iterations; roughly 3–9 s.
              <br />
              Each iteration runs a full 480-month projection.{' '}
              <InfoIcon className="inline h-3.5 w-3.5 text-primary" strokeWidth={1.75} aria-hidden />
            </p>
          </div>
        </div>
      </div>
    </div>);

}
