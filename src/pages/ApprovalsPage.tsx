import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheckIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusChip } from '../components/analytics/StatusChip';
import { useCaseStore } from '../contexts/CaseStore';
import { useRole } from '../contexts/RoleContext';
import { isOpen, pendingDays, pendingText, primaryActionFor, stageLabel, wasReturned } from '../utils/approvalFlow';
import { roleLabel } from '../utils/permissions';
import { productShort } from '../data/products';
import { premiumShort, signedPct } from '../utils/format';
import type { QuoteCase } from '../types';

function CaseCell({ c }: {c: QuoteCase;}): JSX.Element {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to={`/quotes/${c.id}/evidence`}
          className="text-[13px] font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          
          {c.name}
        </Link>
        {wasReturned(c) && <StatusChip tone="warning">Returned</StatusChip>}
      </div>
      <p className="mt-0.5 text-micro text-muted">{c.client} · {productShort(c.product)} · {c.situsState}</p>
    </>);

}

function WaitCell({ c }: {c: QuoteCase;}): JSX.Element {
  const days = pendingDays(c);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[13px] text-muted tnum">{pendingText(days)}</span>
      {days >= 7 ? <StatusChip tone="danger">Overdue</StatusChip> : days >= 3 ? <StatusChip tone="warning">Aging</StatusChip> : null}
    </div>);

}

const th = 'px-4 py-2.5 text-left';

export function ApprovalsPage(): JSX.Element {
  const { cases } = useCaseStore();
  const { role } = useRole();

  const mine = useMemo(() => {
    const open = cases.filter((c) => isOpen(c) && c.approvalStage !== 'Approved');
    return open.filter((c) => primaryActionFor(role, c.approvalStage));
  }, [cases, role]);

  return (
    <div className="mx-auto max-w-[1440px] p-6">
      <PageHeader
        title="Approvals"
        subtitle={`Cases waiting on you as ${roleLabel(role)}. Use "View as" in the top bar to see another role's queue.`} />
      

      <div className="space-y-5">
        <Card accent="primary" title="Needs your action" meta={`${mine.length} case${mine.length === 1 ? '' : 's'}`} padded={false}>
          {mine.length === 0 ?
          <div className="px-5 pb-5">
              <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-line bg-canvas px-6 py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint">
                  <ClipboardCheckIcon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p className="text-[15px] font-semibold text-ink">You're all caught up</p>
                <p className="max-w-sm text-[13px] text-muted">Nothing is waiting on a {roleLabel(role)} right now.</p>
              </div>
            </div> :

          <div className="overflow-x-auto border-t border-line">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-canvas text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                    <th scope="col" className={th}>Case</th>
                    <th scope="col" className={th}>Stage</th>
                    <th scope="col" className={th}>Waiting</th>
                    <th scope="col" className={`${th} text-right`}>Premium</th>
                    <th scope="col" className={`${th} text-right`}>MVP</th>
                    <th scope="col" className="px-4 py-2.5 text-right"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {mine.map((c) => {
                                  return (
                    <tr key={c.id} className="border-b border-line last:border-0 hover:bg-canvas/70">
                        <td className="px-4 py-3"><CaseCell c={c} /></td>
                        <td className="px-4 py-3 text-[13px] text-ink">{stageLabel[c.approvalStage]}</td>
                        <td className="px-4 py-3"><WaitCell c={c} /></td>
                        <td className="px-4 py-3 text-right text-[13px] font-semibold text-ink tnum">{premiumShort(c.inputs.premium)}</td>
                        <td className="px-4 py-3 text-right text-[13px] text-ink tnum">{c.metrics ? signedPct(c.metrics.mvp, 2) : '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end">
                            <Link
                            to={`/quotes/${c.id}/evidence`}
                            className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-[13px] font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">

                              Review
                            </Link>
                          </div>
                        </td>
                      </tr>);

                })}
                </tbody>
              </table>
            </div>
          }
        </Card>

        <p className="text-[13px] text-muted">
          Looking for another quote?{' '}
          <Link to="/quotes" className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            See all quotes
          </Link>
        </p>
      </div>
    </div>);

}
