import React, { useState } from 'react';
import { CheckIcon, SendIcon, SettingsIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  approvalStages,
  stageActionLabel,
  useCaseStore } from
'../../contexts/CaseStore';
import type { QuoteCase } from '../../types';

export function ApprovalWorkflow({ quote }: {quote: QuoteCase;}): JSX.Element {
  const { advanceApproval } = useCaseStore();
  const [assignee, setAssignee] = useState('');
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const currentIndex = approvalStages.indexOf(quote.approvalStage);
  const actionLabel = stageActionLabel[quote.approvalStage];
  const approvalActions = quote.feed.filter(
    (e) => e.kind === 'Approved' || e.kind === 'Submitted for Approval'
  ).length;

  return (
    <Card
      title="Approval Workflow"
      action={
      <p className="text-xs text-muted">
          Assigned to:{' '}
          <span className="font-semibold text-primary">Kiran Yeligeti</span>
          <span className="ml-1.5 rounded bg-canvas px-1.5 py-0.5 text-micro font-semibold uppercase text-muted">
            Admin
          </span>
        </p>
      }>
      
      <ol className="flex items-center">
        {approvalStages.map((stage, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li key={stage} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-micro font-semibold ${
                  done ?
                  'border-success bg-success text-white' :
                  active ?
                  'border-primary bg-primary text-white' :
                  'border-line bg-canvas text-muted'}`
                  }>
                  
                  {done ?
                  <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" /> :

                  i + 1
                  }
                </span>
                <span
                  className={`mt-1.5 text-micro ${
                  active ? 'font-semibold text-primary' : 'text-muted'}`
                  }>
                  
                  {stage}
                </span>
              </div>
              {i < approvalStages.length - 1 &&
              <span
                className={`mx-1 mb-5 h-px flex-1 ${
                i < currentIndex ? 'bg-success' : 'bg-line'}`
                } />

              }
            </li>);

        })}
      </ol>

      <div className="mt-5 flex items-start gap-2.5 rounded-md border border-primary/30 bg-primary-tint px-3.5 py-3">
        <SettingsIcon
          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
          strokeWidth={1.75}
          aria-hidden="true" />
        
        <div>
          <p className="text-[13px] font-semibold text-primary">
            {quote.approvalStage}
            {quote.approvalStage === 'Pricing' ? ' (Actuary)' : ''}
          </p>
          <p className="text-micro text-muted">
            {actionLabel ?
            'Your action is required.' :
            'This case is fully approved.'}
          </p>
        </div>
      </div>

      {actionLabel &&
      <div className="mt-4 rounded-md border border-line bg-canvas p-4">
          <p className="mb-3 text-[13px] font-semibold text-ink">Take Action</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="assignee" className="sr-only">
                Assign to
              </label>
              <input
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Assign to (email/ID)…"
              className="h-9 w-full rounded-md border border-line bg-white px-2.5 text-[13px] text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            
            </div>
            <div>
              <label htmlFor="assignee-name" className="sr-only">
                Name (optional)
              </label>
              <input
              id="assignee-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (optional)"
              className="h-9 w-full rounded-md border border-line bg-white px-2.5 text-[13px] text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            
            </div>
          </div>
          <label htmlFor="approval-comment" className="sr-only">
            Add a comment
          </label>
          <textarea
          id="approval-comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment (optional)…"
          className="mt-3 w-full resize-none rounded-md border border-line bg-white px-3 py-2 text-[13px] text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
        
          <Button
          variant="primary"
          className="mt-3"
          onClick={() => {
            advanceApproval(quote.id, comment.trim());
            setComment('');
            setAssignee('');
            setName('');
          }}
          icon={<SendIcon className="h-4 w-4" strokeWidth={1.75} />}>
          
            {actionLabel}
          </Button>
        </div>
      }

      <p className="mt-4 text-micro font-medium text-primary tnum">
        ▸ Approval History ({approvalActions} actions)
      </p>
    </Card>);

}