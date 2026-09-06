import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangleIcon,
  CheckIcon,
  FolderIcon,
  LayoutTemplateIcon,
  ZapIcon } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { useCaseStore } from '../contexts/CaseStore';
import { products } from '../data/products';
import type { ProductId } from '../types';

export function NewQuotePage(): JSX.Element {
  const { createCase } = useCaseStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [producer, setProducer] = useState('');
  const [situsState, setSitusState] = useState('DE');
  const [dueDate, setDueDate] = useState('');
  const [product, setProduct] = useState<ProductId>('EPPVUL_AVME');
  const [premium, setPremium] = useState('5000000');
  const [payYears, setPayYears] = useState('7');
  const [creditedRate, setCreditedRate] = useState('7');
  const [faSpread, setFaSpread] = useState('80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = createCase({
      name: name.trim() || 'Untitled case',
      client: client.trim() || 'Unassigned client',
      producer: producer.trim() || 'Unassigned producer',
      situsState,
      dueDate,
      product,
      inputs: {
        premium: Number(premium) || 5000000,
        payYears: Number(payYears) || 7,
        saReturn: Number(creditedRate) || 7,
        faSpread: Number(faSpread) || 80
      }
    });
    navigate(`/quotes/${next.id}/overview`);
  };

  return (
    <div className="mx-auto max-w-[980px] p-6">
      <PageHeader
        title="New Quote"
        subtitle="Enter deal terms from the broker. The engine auto-prices and sends to the review queue."
        action={
        <>
            <Button
            variant="secondary"
            icon={
            <LayoutTemplateIcon className="h-4 w-4" strokeWidth={1.75} />
            }>
            
              Browse Templates
            </Button>
            <Button variant="secondary" onClick={() => navigate('/quotes')}>
              Cancel
            </Button>
          </>
        } />
      

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card accent="primary" title="Case details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Case Name"
              value={name}
              onChange={setName}
              placeholder="e.g. Regional Bank BOLI 2026"
              required />
            
            <TextInput
              label="Client"
              value={client}
              onChange={setClient}
              placeholder="e.g. Regional Bank"
              required />
            
            <TextInput
              label="Producer"
              value={producer}
              onChange={setProducer}
              placeholder="e.g. Goldman Sachs" />
            
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Situs State"
                value={situsState}
                onChange={setSitusState}
                placeholder="DE" />
              
              <div className="flex flex-col">
                <label
                  htmlFor="due-date"
                  className="mb-1 text-xs text-muted">
                  
                  Due Date
                </label>
                <input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-9 rounded-md border border-line bg-white px-2.5 text-sm text-ink tnum focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                
              </div>
            </div>
          </div>

          <fieldset className="mt-5">
            <legend className="mb-2 text-xs text-muted">Product *</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {products.map((p) => {
                const active = product === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProduct(p.id)}
                    aria-pressed={active}
                    className={`flex items-center justify-between rounded-md border px-3.5 py-3 text-left text-[13px] font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    active ?
                    'border-primary bg-primary-tint text-primary' :
                    'border-line bg-white text-ink hover:bg-canvas'}`
                    }>
                    
                    {p.label}
                    {active &&
                    <CheckIcon
                      className="h-4 w-4"
                      strokeWidth={2}
                      aria-hidden="true" />

                    }
                  </button>);

              })}
            </div>
          </fieldset>
        </Card>

        <Card title="Deal Terms">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TextInput
              label="Annual Premium ($) *"
              value={premium}
              onChange={setPremium}
              numeric />
            
            <TextInput
              label="Pay Years *"
              value={payYears}
              onChange={setPayYears}
              numeric />
            
            <TextInput
              label="Credited Rate (%) *"
              value={creditedRate}
              onChange={setCreditedRate}
              numeric />
            
            <TextInput
              label="FA Spread (bps)"
              value={faSpread}
              onChange={setFaSpread}
              numeric />
            
          </div>

          <div
            role="status"
            className="mt-4 flex items-start gap-2 rounded-md border border-warning/40 bg-warning-tint px-3.5 py-2.5 text-[13px] text-[#92400E]">
            
            <AlertTriangleIcon
              className="mt-0.5 h-4 w-4 shrink-0"
              strokeWidth={1.75}
              aria-hidden="true" />
            
            <p className="tnum">
              May not meet target — best: −33.14% at 300 bps. Consider higher
              premium or fewer pay years.
            </p>
          </div>
        </Card>

        <Card
          title="Census"
          meta="optional">
          
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-line bg-canvas px-6 py-8 text-center">
            <FolderIcon
              className="h-7 w-7 text-warning"
              strokeWidth={1.5}
              aria-hidden="true" />
            
            <p className="mt-2 text-[13px] font-medium text-ink">
              Drag &amp; drop census files here
            </p>
            <p className="mt-1 text-micro text-muted">
              or click to browse — CSV, TSV, XLSX · up to 10 files · 5MB max each
            </p>
            <p className="mt-1 text-micro text-muted">
              For Excel files, the "Census" sheet is used automatically
            </p>
          </div>
          <p className="mt-4 flex items-center gap-2 text-[13px] text-muted">
            <CheckIcon
              className="h-4 w-4 text-success"
              strokeWidth={2}
              aria-hidden="true" />
            
            Using standard assumptions (auto-configured). Editable in the case
            workspace after creation.
          </p>
        </Card>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <p className="text-micro text-muted">
            Auto-calibrates M&amp;E, runs pricing, generates evidence packet
          </p>
          <Button
            type="submit"
            variant="primary"
            icon={<ZapIcon className="h-4 w-4" strokeWidth={1.75} />}>
            
            Create &amp; Price
          </Button>
        </div>
      </form>
    </div>);

}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  numeric = false,
  required = false







}: {label: string;value: string;onChange: (v: string) => void;placeholder?: string;numeric?: boolean;required?: boolean;}): JSX.Element {
  const id = `nq-${label.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1 text-xs text-muted">
        {label}
      </label>
      <input
        id={id}
        required={required}
        inputMode={numeric ? 'decimal' : 'text'}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 rounded-md border border-line bg-white px-2.5 text-sm text-ink transition-colors duration-150 ease-out placeholder:text-muted/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
        numeric ? 'tnum font-medium' : ''}`
        } />
      
    </div>);

}