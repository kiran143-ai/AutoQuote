import React, { useEffect, useState } from 'react';
import {
  AlertTriangleIcon,
  CheckIcon,
  DownloadIcon,
  LockIcon,
  XIcon } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { MetricTile } from '../../components/ui/MetricTile';
import { ApprovalTimeline } from '../../components/workspace/ApprovalTimeline';
import { ApprovalActions } from '../../components/workspace/ApprovalActions';
import { ApprovalStepsCard } from '../../components/workspace/ApprovalStepsCard';
import { RoleSwitcher } from '../../components/workspace/RoleSwitcher';
import { useWorkspaceCase } from '../../hooks/useWorkspaceCase';
import { readinessChecks, readinessSummary } from '../../utils/caseDerived';
import { governanceThresholds } from '../../data/analysisTools';
import { premiumShort, signedPct } from '../../utils/format';

type ViewMode = 'current' | 'alternate';

const pageSections: {id: string;label: string;}[] = [
{ id: 'evidence-packet', label: 'Evidence Packet' },
{ id: 'governance-thresholds', label: 'Governance Thresholds' },
{ id: 'readiness-checks', label: 'Readiness Checks' }];


function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function EvidenceTab(): JSX.Element {
  const quote = useWorkspaceCase();
  const checks = readinessChecks(quote);
  const summary = readinessSummary(quote);
  const m = quote.metrics;
  const [currentRole, setCurrentRole] = useState('Actuary');
  const [view, setView] = useState<ViewMode>('current');
  const [activeSection, setActiveSection] = useState(pageSections[0].id);

  useEffect(() => {
    if (view !== 'alternate') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
        a.boundingClientRect.top <= b.boundingClientRect.top ? a : b
        );
        setActiveSection(topMost.target.id);
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    );

    pageSections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [view]);

  const approvalCard = <ApprovalStepsCard quote={quote} />;

  const blockersAlert = summary.failed > 0 &&
  <div
    role="alert"
    className="flex items-start gap-2.5 rounded-card border border-danger/40 bg-danger-tint px-4 py-3 shadow-card">

    <AlertTriangleIcon
      className="mt-0.5 h-4 w-4 shrink-0 text-danger"
      strokeWidth={1.75}
      aria-hidden="true" />

    <div>
      <p className="text-[13px] font-semibold text-[#B91C1C]">
        {summary.failed} blocker
        {summary.failed === 1 ? '' : 's'} present at submission
      </p>
      <p className="mt-0.5 text-micro text-muted tnum">
        Readiness score: {summary.score}% · {summary.passed}/
        {summary.total} checks passed
      </p>
    </div>
  </div>;


  const evidencePacketCard =
  <div id="evidence-packet" className="scroll-mt-20">
      <Card
      accent="primary"
      title="Evidence Packet"
      meta={`Frozen at submission · 9/5/2026, 2:11:34 PM · by Kiran Yeligeti`}
      action={
      <>
            <Button
          size="sm"
          variant="secondary"
          icon={<DownloadIcon className="h-4 w-4" strokeWidth={1.75} />}>

              Export PDF
            </Button>
            <span className="inline-flex items-center gap-1 rounded-md border border-line bg-canvas px-2.5 py-1.5 text-micro font-medium text-muted">
              <LockIcon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              Read-only snapshot
            </span>
          </>
      }>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <ProgressRing value={summary.score} size={64} tone={summary.failed ? '#F0A500' : '#28A745'} />
          </div>
          <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricTile
            label="MVP"
            value={m ? `${m.mvp.toFixed(2)}%` : '—'}
            tone="success"
            emphasis />

            <MetricTile
            label="Strain"
            value={m ? signedPct(m.strain, 2) : '—'}
            tone="warning" />

            <MetricTile label="M&E" value={`${quote.inputs.me} bps`} />
            <MetricTile
            label="Premium"
            value={premiumShort(quote.inputs.premium)} />

            <MetricTile label="Lives" value={quote.inputs.lives} />
            <MetricTile label="Round" value={`#${quote.round}`} />
            <MetricTile
            label="Break-even"
            value={m ? `Mo ${m.breakEven}` : '—'} />

          </div>
        </div>
      </Card>
    </div>;


  const governanceCard =
  <div id="governance-thresholds" className="scroll-mt-20">
      <Card accent="primary" title="Governance Thresholds" meta="at submission">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {governanceThresholds.map((t) =>
        <div
          key={t.label}
          className="flex items-baseline justify-between rounded-md border border-line bg-canvas px-3.5 py-2.5">

              <span className="text-micro uppercase tracking-[0.06em] text-muted">
                {t.label}
              </span>
              <span className="text-[13px] font-semibold text-ink tnum">
                {t.value}
              </span>
            </div>
        )}
        </div>
      </Card>
    </div>;


  const readinessCard =
  <div id="readiness-checks" className="scroll-mt-20">
      <Card
      accent="primary"
      title="Readiness Checks"
      meta={`${summary.passed} pass · ${summary.failed} fail · ${summary.warned} warn`}>

        <ul className="space-y-1.5">
          {checks.map((check) => {
          const tone =
          check.state === 'pass' ?
          'border-success/25 bg-success-tint' :
          check.state === 'fail' ?
          'border-danger/30 bg-danger-tint' :
          'border-warning/40 bg-warning-tint';
          return (
            <li
              key={check.label}
              className={`flex flex-wrap items-center justify-between gap-2 rounded-md border px-3.5 py-2.5 ${tone}`}>

                <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
                  {check.state === 'pass' &&
                <CheckIcon
                  className="h-4 w-4 text-success"
                  strokeWidth={2}
                  aria-hidden="true" />

                }
                  {check.state === 'fail' &&
                <XIcon
                  className="h-4 w-4 text-danger"
                  strokeWidth={2}
                  aria-hidden="true" />

                }
                  {check.state === 'warn' &&
                <AlertTriangleIcon
                  className="h-4 w-4 text-[#92400E]"
                  strokeWidth={1.75}
                  aria-hidden="true" />

                }
                  <span
                  className={
                  check.state === 'fail' ? 'text-[#B91C1C]' : undefined
                  }>

                    {check.label}
                  </span>
                </span>
                <span className="text-micro text-muted tnum">
                  {check.value}
                </span>
              </li>);

        })}
        </ul>
      </Card>
    </div>;


  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-2">
        <label htmlFor="evidence-view" className="text-xs font-medium text-muted">
          View
        </label>
        <select
          id="evidence-view"
          value={view}
          onChange={(e) => setView(e.target.value as ViewMode)}
          className="h-9 rounded-md border border-line bg-white px-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

          <option value="current">Current View</option>
          <option value="alternate">Alternate View</option>
        </select>
      </div>

      {view === 'current' ?
      <div className="space-y-5">
          {approvalCard}
          {blockersAlert}
          {evidencePacketCard}
          {governanceCard}
          {readinessCard}
        </div> :

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-5">
            {blockersAlert}
            {evidencePacketCard}
            {governanceCard}
            {readinessCard}
          </div>

          <div className="space-y-5 xl:sticky xl:top-16 xl:self-start">
            {approvalCard}

            <Card accent="primary" title="On This Page">
              <nav aria-label="Evidence tab sections" className="flex flex-col gap-0.5">
                {pageSections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(section.id);
                      scrollToSection(section.id);
                    }}
                    className={`rounded-md border-l-2 px-2.5 py-2 text-[13px] transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive ?
                    'border-primary bg-primary-tint font-semibold text-primary' :
                    'border-transparent font-medium text-ink hover:bg-canvas hover:text-primary'}`
                    }>

                      {section.label}
                    </a>);

              })}
              </nav>
            </Card>
          </div>
        </div>
      }

      {/* <div className="rounded-lg border-2 border-primary bg-primary-tint p-6">
        <div className="flex items-center gap-2">
          <CheckIcon className="h-6 w-6 text-primary" strokeWidth={2} />
          <div>
            <h2 className="text-lg font-bold text-primary">Approval Workflow</h2>
            <p className="text-xs text-primary/80">Submit for multi-level approval</p>
          </div>
        </div>

        <div className="space-y-5">
          <ApprovalTimeline quote={quote} />

          <hr className="border-primary/20" />

          <RoleSwitcher currentRole={currentRole} onRoleChange={setCurrentRole} />

          <ApprovalActions quote={quote} currentRole={currentRole} />
        </div>
      </div> */}
    </div>);

}
