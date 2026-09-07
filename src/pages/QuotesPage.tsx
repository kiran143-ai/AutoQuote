import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, SearchIcon, TargetIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { QuotesTable } from '../components/quotes/QuotesTable';
import { useCaseStore } from '../contexts/CaseStore';
import { statusFilters } from '../data/cases';
import { products } from '../data/products';
import type { CaseStatus } from '../types';

export function QuotesPage(): JSX.Element {
  const { cases, cloneCase } = useCaseStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof statusFilters)[number]>('All');
  const [product, setProduct] = useState('all');
  const [mineOnly, setMineOnly] = useState(false);

  const filtered = useMemo(
    () =>
    cases.filter((c) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.client.toLowerCase().includes(q) ||
      c.producer.toLowerCase().includes(q);
      const matchesStatus = status === 'All' || c.status === status;
      const matchesProduct = product === 'all' || c.product === product;
      const matchesMine = !mineOnly || c.producer.length > 0;
      return matchesQuery && matchesStatus && matchesProduct && matchesMine;
    }),
    [cases, query, status, product, mineOnly]
  );

  const pipeline: {status: CaseStatus;count: number;}[] = (
  ['Draft', 'Quoted', 'Approved', 'Won', 'Declined', 'Lost'] as CaseStatus[]).
  map((s) => ({ status: s, count: cases.filter((c) => c.status === s).length }));

  const productMix = products.
  map((p) => ({
    label: p.short,
    count: cases.filter((c) => c.product === p.id).length
  })).
  filter((p) => p.count > 0);

  const handleReuse = (id: string) => {
    navigate(`/quotes/new?cloneFrom=${id}`);
  };

  return (
    <div className="mx-auto max-w-[1440px] p-6">
      <PageHeader
        title="All Quotes"
        subtitle={`Showing ${filtered.length} of ${cases.length} cases`}
        action={
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/quotes/new')}
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
      

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Card padded={false}>
            <div className="space-y-3 px-5 pt-5">
              <div className="relative">
                <SearchIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  strokeWidth={1.75}
                  aria-hidden="true" />
                
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by case name, client, or producer..."
                  aria-label="Search quotes"
                  className="h-10 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm text-ink transition-colors duration-150 ease-out placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                    Status
                  </span>
                  {statusFilters.map((s) =>
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    aria-pressed={status === s}
                    className={`h-7 rounded-full border px-3 text-xs font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    status === s ?
                    'border-primary bg-primary text-white' :
                    'border-line bg-white text-ink hover:bg-canvas'}`
                    }>
                    
                      {s}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="product-filter"
                    className="text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                    
                    Product
                  </label>
                  <select
                    id="product-filter"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="h-7 rounded-md border border-line bg-white px-2 text-xs text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    
                    <option value="all">All products</option>
                    {products.map((p) =>
                    <option key={p.id} value={p.id}>
                        {p.short}
                      </option>
                    )}
                  </select>
                  <button
                    type="button"
                    onClick={() => setMineOnly((v) => !v)}
                    aria-pressed={mineOnly}
                    className={`h-7 rounded-md border px-3 text-xs font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    mineOnly ?
                    'border-primary bg-primary-tint text-primary' :
                    'border-line bg-white text-ink hover:bg-canvas'}`
                    }>
                    
                    Mine
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-line">
              <QuotesTable
                cases={filtered}
                onReuse={handleReuse}
                selectable
                showRowMenu />
              
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Pipeline" meta={`${cases.length} cases`}>
            <table className="w-full text-[13px]">
              <tbody>
                {pipeline.map((row) =>
                <tr key={row.status} className="border-b border-line last:border-0">
                    <td className="py-2 text-ink">{row.status}</td>
                    <td className="py-2 text-right font-semibold text-ink tnum">
                      {row.count}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>

          <Card
            title="Product Mix"
            meta={`${productMix.length} product${
            productMix.length === 1 ? '' : 's'}`
            }>
            
            <ul className="space-y-2.5">
              {productMix.map((p) =>
              <li key={p.label}>
                  <div className="flex items-baseline justify-between text-[13px]">
                    <span className="text-ink">{p.label}</span>
                    <span className="font-semibold text-ink tnum">{p.count}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-canvas">
                    <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${p.count / cases.length * 100}%` }} />
                  
                  </div>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>);

}