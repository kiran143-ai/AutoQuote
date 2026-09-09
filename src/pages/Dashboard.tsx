import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, PlusIcon, TargetIcon, WalletIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { QuotesTable } from '../components/quotes/QuotesTable';
import { useCaseStore } from '../contexts/CaseStore';
import { premiumShort } from '../utils/format';
import type { CaseStatus } from '../types';

const pipelineOrder: CaseStatus[] = [
'Draft',
'Quoted',
'Approved',
'Won',
'Declined',
'Lost'];


export function Dashboard(): JSX.Element {
  const { cases } = useCaseStore();
  const navigate = useNavigate();

  const priced = cases.filter((c) => c.metrics);
  const avgMvp = priced.length ?
  priced.reduce((sum, c) => sum + (c.metrics?.mvp ?? 0), 0) / priced.length :
  0;
  const activePremium = cases.
  filter((c) => c.status !== 'Lost' && c.status !== 'Declined').
  reduce((sum, c) => sum + c.inputs.premium, 0);
  const pendingActions = cases.filter(
    (c) => !c.priced && c.status === 'Draft'
  );
  const counts = pipelineOrder.map((status) => ({
    status,
    count: cases.filter((c) => c.status === status).length
  }));
  const maxCount = Math.max(1, ...counts.map((c) => c.count));

  const recent = [...cases].
  sort((a, b) => a.updated < b.updated ? 1 : -1).
  slice(0, 6);

  const handleReuse = (id: string) => {
    navigate(`/quotes/new?cloneFrom=${id}`);
  };

  return (
    <div className="mx-auto max-w-[1440px] p-6">
      <PageHeader
        title="Dashboard"
        subtitle="Pipeline, pricing health, and cases awaiting your action."
        action={
        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled
            icon={<TargetIcon className="h-4 w-4" strokeWidth={2} />}>
            Quick Run
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/quotes/new')}
            icon={<PlusIcon className="h-4 w-4" strokeWidth={2} />}>
            New Quote
          </Button>
        </div>
        } />
      

      {/* Primary KPIs — the three numbers a pricing analyst opens the day with */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card accent="primary" className="lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                Total Premium in Pipeline
              </p>
              <p className="mt-2 text-[34px] font-bold leading-9 text-ink tnum">
                {premiumShort(activePremium)}
              </p>
              <p className="mt-1 text-xs text-muted tnum">
                Across {cases.length} active quotes
              </p>
            </div>
            <WalletIcon
              className="h-5 w-5 text-muted"
              strokeWidth={1.75}
              aria-hidden="true" />
            
          </div>
        </Card>

        <Card accent="primary">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                Avg. MVP %
              </p>
              <p className="mt-2 text-[34px] font-bold leading-9 text-ink tnum">
                {priced.length ? `${avgMvp.toFixed(2)}%` : '—'}
              </p>
              <p className="mt-1 text-xs text-muted tnum">
                {priced.length} priced case{priced.length === 1 ? '' : 's'} ·
                target 3.23%
              </p>
            </div>
            <TargetIcon
              className="h-5 w-5 text-muted"
              strokeWidth={1.75}
              aria-hidden="true" />
            
          </div>
        </Card>

        <Card accent={pendingActions.length ? 'warning' : 'none'}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                Pending Actions
              </p>
              <p className="mt-2 text-[34px] font-bold leading-9 text-ink tnum">
                {pendingActions.length}
              </p>
              <p className="mt-1 text-xs text-muted">
                {pendingActions.length ?
                `${pendingActions.length} action pending · ${pendingActions.
                map((c) => c.name).
                join(', ')}` :
                'Nothing waiting on you'}
              </p>
            </div>
            <AlertCircleIcon
              className={`h-5 w-5 ${
              pendingActions.length ? 'text-warning' : 'text-muted'}`
              }
              strokeWidth={1.75}
              aria-hidden="true" />
            
          </div>
        </Card>
      </div>

      {/* Secondary counts — deliberately lighter than the primary KPIs */}
      <div className="mt-5 grid grid-cols-2 divide-line rounded-card border border-line bg-white shadow-card sm:grid-cols-4 sm:divide-x">
        {[
        { label: 'Total Quotes', value: cases.length },
        {
          label: 'Draft / In Progress',
          value: cases.filter((c) => c.status === 'Draft').length
        },
        {
          label: 'Quoted / Priced',
          value: cases.filter((c) => c.status === 'Quoted').length
        },
        {
          label: 'Approved / Won',
          value: cases.filter(
            (c) => c.status === 'Approved' || c.status === 'Won'
          ).length
        }].
        map((kpi) =>
        <div key={kpi.label} className="px-5 py-4">
            <p className="text-micro font-medium uppercase tracking-[0.06em] text-muted">
              {kpi.label}
            </p>
            <p className="mt-1 text-xl font-semibold text-ink tnum">
              {kpi.value}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <Card
          title="Your Cases / Recent Quotes"
          meta={`${recent.length} of ${cases.length} · latest activity`}
          padded={false}
          action={
          <Link
            to="/quotes"
            className="text-[13px] font-medium text-primary hover:underline">
            
              View all quotes
            </Link>
          }>
          
          <div className="border-t border-line">
            <QuotesTable cases={recent} onReuse={handleReuse} />
          </div>
        </Card>

        <Card title="Pipeline by Status" meta={`${cases.length} cases`}>
          <ul className="space-y-3">
            {counts.map((row) =>
            <li key={row.status}>
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="text-ink">{row.status}</span>
                  <span className="font-semibold text-ink tnum">
                    {row.count}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
                  <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${row.count / maxCount * 100}%` }} />
                
                </div>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>);

}