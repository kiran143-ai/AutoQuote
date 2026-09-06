import React from 'react';
import { Link } from 'react-router-dom';
import { CopyIcon, MoreVerticalIcon } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { productShort } from '../../data/products';
import { premiumShort, shortDate } from '../../utils/format';
import type { QuoteCase } from '../../types';

interface QuotesTableProps {
  cases: QuoteCase[];
  onReuse?: (id: string) => void;
  selectable?: boolean;
  showRowMenu?: boolean;
}

export function QuotesTable({
  cases,
  onReuse,
  selectable = false,
  showRowMenu = false
}: QuotesTableProps): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas text-micro font-semibold uppercase tracking-[0.06em] text-muted">
            {selectable &&
            <th scope="col" className="w-10 px-4 py-2.5 text-left">
                <span className="sr-only">Select</span>
              </th>
            }
            <th scope="col" className="px-4 py-2.5 text-left">
              Case
            </th>
            <th scope="col" className="px-4 py-2.5 text-left">
              Client
            </th>
            <th scope="col" className="px-4 py-2.5 text-left">
              Status
            </th>
            <th scope="col" className="px-4 py-2.5 text-right">
              Premium
            </th>
            <th scope="col" className="px-4 py-2.5 text-right">
              Due
            </th>
            <th scope="col" className="px-4 py-2.5 text-right">
              Updated
            </th>
            <th scope="col" className="w-28 px-4 py-2.5 text-right">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) =>
          <tr
            key={c.id}
            className="border-b border-line last:border-0 hover:bg-canvas/70">
            
              {selectable &&
            <td className="px-4 py-3">
                  <input
                type="checkbox"
                aria-label={`Select ${c.name}`}
                className="h-4 w-4 rounded border-line text-primary focus:ring-primary" />
              
                </td>
            }
              <td className="px-4 py-3">
                <Link
                to={`/quotes/${c.id}/overview`}
                className="text-[13px] font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                
                  {c.name}
                </Link>
                <p className="mt-0.5 text-micro text-muted">
                  {productShort(c.product)} · {c.inputs.lives} lives ·{' '}
                  {c.situsState}
                </p>
              </td>
              <td className="px-4 py-3 text-[13px] text-ink">{c.client}</td>
              <td className="px-4 py-3">
                <StatusBadge status={c.status} size="sm" />
              </td>
              <td className="px-4 py-3 text-right text-[13px] font-semibold text-ink tnum">
                {premiumShort(c.inputs.premium)}
              </td>
              <td className="px-4 py-3 text-right text-[13px] text-muted tnum">
                {c.dueDate ? shortDate(c.dueDate) : '—'}
              </td>
              <td className="px-4 py-3 text-right text-[13px] text-muted tnum">
                {shortDate(c.updated)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {onReuse && c.status === 'Approved' &&
                <button
                  type="button"
                  onClick={() => onReuse(c.id)}
                  className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-micro font-medium text-primary transition-colors duration-150 ease-out hover:bg-primary-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  
                      <CopyIcon
                    className="h-3.5 w-3.5"
                    strokeWidth={1.75}
                    aria-hidden="true" />
                  
                      Reuse
                    </button>
                }
                  {showRowMenu &&
                <button
                  type="button"
                  aria-label={`More actions for ${c.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors duration-150 ease-out hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  
                      <MoreVerticalIcon
                    className="h-4 w-4"
                    strokeWidth={1.75}
                    aria-hidden="true" />
                  
                    </button>
                }
                </div>
              </td>
            </tr>
          )}
          {cases.length === 0 &&
          <tr>
              <td
              colSpan={selectable ? 8 : 7}
              className="px-4 py-10 text-center text-sm text-muted">
              
                No quotes match the current filters.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>);

}