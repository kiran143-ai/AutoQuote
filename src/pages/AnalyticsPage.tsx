import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangleIcon, DownloadIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/analytics/KpiCard';
import { StatusChip } from '../components/analytics/StatusChip';
import { useCaseStore } from '../contexts/CaseStore';
import { productShort } from '../data/products';
import { premiumShort } from '../utils/format';

const analyticsTabs = [
'Pipeline', 'Market Trends', 'Round Efficiency', 'SVW Analytics', 'Pricing Consistency',
'Win/Loss', 'Pricing Log', 'Executive', 'Source of Earnings'];


const periods = ['All time', 'Last 90 days', 'Last 6 months', 'Last 12 months', 'YTD'];

const dataGaps: {label: string;reason: string;status: 'BLOCKED' | 'PARTIAL';}[] = [
{ label: 'Cycle time', reason: 'Needs claim-event fields to split queue time from active pricing.', status: 'BLOCKED' },
{ label: 'Approval latency', reason: 'Status history starts recording from go-live. No backfill.', status: 'PARTIAL' },
{ label: 'Loss reason', reason: 'Not captured on declined or lost cases yet.', status: 'BLOCKED' },
{ label: 'Concession across rounds', reason: 'Opening quote is captured from the first quote forward only.', status: 'PARTIAL' }];


const dataReadiness: {label: string;status: 'HAVE' | 'PARTIAL' | 'BLOCKED';}[] = [
{ label: 'Premium and volume', status: 'HAVE' },
{ label: 'Rounds', status: 'PARTIAL' },
{ label: 'Producer', status: 'PARTIAL' },
{ label: 'Run economics', status: 'PARTIAL' },
{ label: 'Cycle time', status: 'BLOCKED' },
{ label: 'Loss reason', status: 'BLOCKED' },
{ label: 'Model risk', status: 'BLOCKED' }];


const readinessTone = { HAVE: 'success', PARTIAL: 'warning', BLOCKED: 'danger' } as const;

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange
}: {label: string;options: readonly T[];value: T;onChange: (v: T) => void;}): JSX.Element {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap overflow-hidden rounded-md border border-line">
      {options.map((opt, i) =>
      <button
        key={opt}
        type="button"
        aria-pressed={value === opt}
        onClick={() => onChange(opt)}
        className={`px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        i > 0 ? 'border-l border-line' : ''} ${
        value === opt ? 'bg-primary text-white' : 'bg-white text-ink hover:bg-canvas'}`
        }>

          {opt}
        </button>
      )}
    </div>);

}

function Empty({ text }: {text: string;}): JSX.Element {
  return (
    <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-line bg-canvas px-4 text-center text-[13px] text-muted">
      {text}
    </div>);

}

export function AnalyticsPage(): JSX.Element {
  const { cases } = useCaseStore();
  const [tab, setTab] = useState(analyticsTabs[0]);
  const [period, setPeriod] = useState<(typeof periods)[number]>('All time');
  const [measure, setMeasure] = useState<'Premium-weighted' | 'Count'>('Premium-weighted');

  const stats = useMemo(() => {
    const count = (s: string) => cases.filter((c) => c.status === s).length;
    const won = cases.filter((c) => c.status === 'Approved' || c.status === 'Won');
    const premiumWritten = won.reduce((sum, c) => sum + c.inputs.premium, 0);
    const decided = cases.filter((c) => ['Approved', 'Won', 'Declined', 'Lost'].includes(c.status)).length;
    const inFlight = count('Draft') + count('Quoted');

    const byProduct = (['EPPVUL_AVME', 'EPPVUL_PBME'] as const).map((p) => {
      const items = cases.filter((c) => c.product === p);
      return {
        name: productShort(p),
        premium: items.reduce((s, c) => s + c.inputs.premium, 0) / 1_000_000,
        count: items.length
      };
    });

    const byMonth = Object.entries(
      cases.reduce<Record<string, number>>((acc, c) => {
        const key = c.updated.slice(0, 7);
        acc[key] = (acc[key] ?? 0) + c.inputs.premium / 1_000_000;
        return acc;
      }, {})
    ).
    sort(([a], [b]) => a.localeCompare(b)).
    map(([month, premium]) => ({ month, premium: Number(premium.toFixed(1)) }));

    const premiums = [...cases].sort((a, b) => b.inputs.premium - a.inputs.premium);
    const topThree = premiums.slice(0, 3).reduce((s, c) => s + c.inputs.premium, 0);

    return {
      total: cases.length,
      draft: count('Draft'),
      quoted: count('Quoted'),
      approved: won.length,
      declined: count('Declined'),
      lost: count('Lost'),
      inFlight,
      premiumWritten,
      decided,
      byProduct,
      byMonth,
      largest: premiums[0]?.inputs.premium ?? 0,
      topThree,
      above100M: cases.filter((c) => c.inputs.premium > 100_000_000).length
    };
  }, [cases]);

  const funnel = [
  { label: 'Draft', value: stats.draft, tone: 'bg-warning' },
  { label: 'Quoted', value: stats.quoted, tone: 'bg-primary' },
  { label: 'Approved', value: stats.approved, tone: 'bg-success' },
  { label: 'Declined', value: stats.declined, tone: 'bg-danger' }];

  const funnelMax = Math.max(1, ...funnel.map((f) => f.value));
  const approvalRate = stats.decided ? Math.round((stats.approved / stats.decided) * 100) : null;

  return (
    <div className="mx-auto max-w-[1440px] p-6">
      <PageHeader
        title="Analytics"
        subtitle={`Pipeline performance across ${stats.total} cases · ${stats.inFlight} in flight`}
        action={
        <Button variant="outline" size="sm" disabled title="Available in a later phase" icon={<DownloadIcon className="h-4 w-4" strokeWidth={1.75} />}>
          Export QBR PDF
        </Button>
        } />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Segmented label="Period" options={periods} value={period} onChange={setPeriod} />
        </div>
        <Segmented label="Measure" options={['Premium-weighted', 'Count'] as const} value={measure} onChange={setMeasure} />
      </div>

      <div role="tablist" aria-label="Analytics views" className="mb-5 flex gap-1 overflow-x-auto border-b border-line">
        {analyticsTabs.map((t) =>
        <button
          key={t}
          role="tab"
          aria-selected={tab === t}
          type="button"
          onClick={() => setTab(t)}
          className={`-mb-px shrink-0 border-b-2 px-3.5 py-2.5 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          tab === t ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-ink'}`
          }>

            {t}
          </button>
        )}
      </div>

      {tab !== 'Pipeline' ?
      <Empty text={`${tab} analytics will be available in a later phase.`} /> :

      <div className="space-y-5">
          <div className="flex items-start gap-2.5 rounded-card border border-warning/40 bg-warning-tint px-4 py-3 text-[13px] text-[#92400E]">
            <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <p>Figures come from engine output (v2.0) and are not yet verified against workbooks. Series across engine versions are not directly comparable.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
            label="Premium written"
            value={premiumShort(stats.premiumWritten)}
            caption={`${stats.approved} approved ${stats.approved === 1 ? 'case' : 'cases'} · largest ${premiumShort(stats.largest)}`} />

            <KpiCard
            label="PV profit written"
            value="Not available"
            unavailable
            caption="Run records do not yet store PV profit per case." />

            <KpiCard
            label="Hit rate, premium-weighted"
            value={approvalRate === null ? 'N/A' : `${approvalRate}%`}
            unavailable={approvalRate === null}
            caption={approvalRate === null ? `Needs 5+ decided cases (have ${stats.decided})` : `${stats.approved} of ${stats.decided} decided cases`} />

            <KpiCard
            label="Approval latency (median)"
            value="Not available"
            unavailable
            caption="Builds up as status history accrues." />

          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card accent="primary" title="Product mix" meta="Premium ($M) and case count by product family">
              {stats.total === 0 ?
            <Empty text="No cases yet." /> :

            <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.byProduct} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="#E5E7EB" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} stroke="#E5E7EB" />
                      <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} stroke="#E5E7EB" tickFormatter={(v: number) => `$${v}M`} width={56} />
                      <Tooltip formatter={(v: number) => [`$${v}M`, 'Premium']} />
                      <Bar dataKey={measure === 'Count' ? 'count' : 'premium'} fill="#1D4ED8" radius={[4, 4, 0, 0]}>
                        {stats.byProduct.map((p) => <Cell key={p.name} fill="#1D4ED8" />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            }
            </Card>

            <Card accent="primary" title="Premium by month" meta="New premium ($M) by last-updated month">
              {stats.byMonth.length === 0 ?
            <Empty text="No activity yet." /> :

            <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.byMonth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="#E5E7EB" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} stroke="#E5E7EB" />
                      <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} stroke="#E5E7EB" tickFormatter={(v: number) => `$${v}M`} width={56} />
                      <Tooltip formatter={(v: number) => [`$${v}M`, 'Premium']} />
                      <Line type="monotone" dataKey="premium" stroke="#1D4ED8" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
            }
            </Card>
          </div>

          <Card accent="primary" title="Status funnel" meta={`Draft → Quoted → Approved / Declined · approval rate ${approvalRate === null ? 'N/A' : `${approvalRate}%`}`}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {funnel.map((f) =>
              <div key={f.label} className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] font-medium text-ink">{f.label}</span>
                    <span className="text-lg font-bold text-ink tnum">{f.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-canvas" role="img" aria-label={`${f.label}: ${f.value} cases`}>
                    <div className={`h-full rounded-full ${f.tone}`} style={{ width: `${(f.value / funnelMax) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Card accent="primary" title="Data readiness" meta="What this page can report today" className="lg:col-span-1">
              <ul className="divide-y divide-line">
                {dataReadiness.map((d) =>
                <li key={d.label} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="text-[13px] text-ink">{d.label}</span>
                    <StatusChip tone={readinessTone[d.status]}>{d.status}</StatusChip>
                  </li>
              )}
              </ul>
            </Card>

            <Card accent="primary" title="Data gaps" meta="Metrics waiting on data capture" className="lg:col-span-2">
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {dataGaps.map((g) =>
                <li key={g.label} className="rounded-md border border-line bg-canvas px-3.5 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-ink">{g.label}</span>
                      <StatusChip tone={g.status === 'BLOCKED' ? 'danger' : 'warning'}>{g.status}</StatusChip>
                    </div>
                    <p className="mt-1 text-xs text-muted">{g.reason}</p>
                  </li>
              )}
              </ul>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Card accent="primary" title="Why we lost" meta={`${stats.lost} lost ${stats.lost === 1 ? 'case' : 'cases'}`}>
              <p className="text-[13px] text-ink">Reason recorded: <span className="font-semibold text-danger">not captured</span></p>
              <p className="mt-2 text-xs text-muted">Capture a loss reason to unlock this view.</p>
            </Card>
            <Card accent="primary" title="Concentration" meta="Premium exposure across the book">
              <dl className="divide-y divide-line text-[13px]">
                <div className="flex justify-between py-2"><dt className="text-muted">Largest case</dt><dd className="font-semibold text-ink tnum">{premiumShort(stats.largest)}</dd></div>
                <div className="flex justify-between py-2"><dt className="text-muted">Top three</dt><dd className="font-semibold text-ink tnum">{premiumShort(stats.topThree)}</dd></div>
                <div className="flex justify-between py-2"><dt className="text-muted">Cases above $100M</dt><dd className="font-semibold text-ink tnum">{stats.above100M}</dd></div>
              </dl>
            </Card>
          </div>
        </div>
      }
    </div>);

}
