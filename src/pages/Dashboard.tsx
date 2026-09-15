import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, PlusIcon, TargetIcon, WalletIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { QuotesTable } from '../components/quotes/QuotesTable';
import { useCaseStore } from '../contexts/CaseStore';
// import { useTheme } from '../contexts/ThemeContext';
// import { themeColors } from '../utils/theme';
import { premiumShort } from '../utils/format';
import type { CaseStatus } from '../types';

const pipelineOrder: CaseStatus[] = [
'Draft',
'Quoted',
'Approved',
'Won',
'Declined',
'Lost'];


const buttonColor = '#1D4ED8';

export function Dashboard(): JSX.Element {
  const { cases } = useCaseStore();
  // const { theme } = useTheme();
  const navigate = useNavigate();
  // const colors = themeColors[theme];

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
            icon={<PlusIcon className="h-4 w-4" strokeWidth={2} />}
            style={{ backgroundColor: buttonColor }}>
            New Quote
          </Button>
        </div>
        } />
      

      {/* Primary KPIs — Placeholder data */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card accent="primary" className="lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                Metric 1
              </p>
              <p className="mt-2 text-[34px] font-bold leading-9 text-ink tnum">
                $250M
              </p>
              <p className="mt-1 text-xs text-muted tnum">
                Across active quotes
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
                Metric 2
              </p>
              <p className="mt-2 text-[34px] font-bold leading-9 text-ink tnum">
                3.45%
              </p>
              <p className="mt-1 text-xs text-muted tnum">
                Target 3.23%
              </p>
            </div>
            <TargetIcon
              className="h-5 w-5 text-muted"
              strokeWidth={1.75}
              aria-hidden="true" />

          </div>
        </Card>

        <Card accent="primary">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                Metric 3
              </p>
              <p className="mt-2 text-[34px] font-bold leading-9 text-ink tnum">
                2
              </p>
              <p className="mt-1 text-xs text-muted">
                Actions awaiting review
              </p>
            </div>
            <AlertCircleIcon
              className="h-5 w-5 text-muted"
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

      <Card
        title="Your Cases / Recent Quotes"
        meta={`${recent.length} of ${cases.length} · latest activity`}
        padded={false}
        className="mt-6"
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
    </div>);

}