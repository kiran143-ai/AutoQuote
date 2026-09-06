import React, { useMemo, useState } from 'react';
import {
  CheckCircle2Icon,
  FileTextIcon,
  MessageSquareIcon,
  SendIcon,
  UploadCloudIcon } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useWorkspaceCase } from '../../hooks/useWorkspaceCase';
import { useCaseStore } from '../../contexts/CaseStore';
import { relativeFromNow, shortDate } from '../../utils/format';
import type { FeedKind } from '../../types';

const kindIcon: Record<FeedKind, React.ElementType> = {
  Approved: CheckCircle2Icon,
  'Submitted for Approval': UploadCloudIcon,
  'Case Created': FileTextIcon,
  Comment: MessageSquareIcon
};

const kindTone: Record<FeedKind, string> = {
  Approved: 'text-success bg-success-tint border-success/30',
  'Submitted for Approval': 'text-[#7C3AED] bg-[#F5F3FF] border-[#7C3AED]/30',
  'Case Created': 'text-primary bg-primary-tint border-primary/30',
  Comment: 'text-muted bg-canvas border-line'
};

export function HistoryTab(): JSX.Element {
  const quote = useWorkspaceCase();
  const { addComment } = useCaseStore();
  const [view, setView] = useState<'Comments' | 'Activity Log'>('Comments');
  const [filter, setFilter] = useState<'All' | 'Comments' | 'Events'>('All');
  const [draft, setDraft] = useState('');

  const entries = useMemo(() => {
    const list = [...quote.feed].reverse();
    if (filter === 'Comments') return list.filter((e) => e.kind === 'Comment');
    if (filter === 'Events') return list.filter((e) => e.kind !== 'Comment');
    return list;
  }, [quote.feed, filter]);

  const commentCount = quote.feed.filter((e) => e.kind === 'Comment').length;

  return (
    <div className="max-w-[980px] space-y-4">
      <div className="flex gap-1.5">
        {(['Comments', 'Activity Log'] as const).map((v) =>
        <button
          key={v}
          type="button"
          onClick={() => setView(v)}
          aria-pressed={view === v}
          className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          view === v ?
          'border-primary bg-primary text-white' :
          'border-line bg-white text-ink hover:bg-canvas'}`
          }>
          
            {v === 'Comments' ?
          <MessageSquareIcon className="h-4 w-4" strokeWidth={1.75} /> :

          <FileTextIcon className="h-4 w-4" strokeWidth={1.75} />
          }
            {v}
          </button>
        )}
      </div>

      <Card
        accent="primary"
        title="Case Feed"
        action={
        <div className="flex gap-1">
            {(['All', 'Comments', 'Events'] as const).map((f) =>
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`h-7 rounded-full border px-2.5 text-xs font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            filter === f ?
            'border-primary bg-primary text-white' :
            'border-line bg-white text-muted hover:text-ink'}`
            }>
            
                {f}
              </button>
          )}
          </div>
        }>
        
        {view === 'Comments' &&
        <div className="flex gap-3 rounded-md border border-line bg-canvas p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
              KY
            </span>
            <div className="flex-1">
              <label htmlFor="comment" className="sr-only">
                Add a comment
              </label>
              <textarea
              id="comment"
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a comment — context for the team, client feedback, pricing rationale…"
              className="w-full resize-none rounded-md border border-line bg-white px-3 py-2 text-[13px] text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            
              <div className="mt-2 flex items-center justify-between">
                <span className="text-micro text-muted">⌘+Enter to post</span>
                <Button
                size="sm"
                variant="primary"
                disabled={!draft.trim()}
                onClick={() => {
                  addComment(quote.id, draft.trim());
                  setDraft('');
                }}
                icon={<SendIcon className="h-3.5 w-3.5" strokeWidth={1.75} />}>
                
                  Post
                </Button>
              </div>
            </div>
          </div>
        }

        <ul className="mt-4 space-y-1">
          {entries.map((entry) => {
            const Icon = kindIcon[entry.kind];
            return (
              <li
                key={entry.id}
                className="flex items-start gap-3 rounded-md px-2 py-2.5 hover:bg-canvas/70">
                
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                  kindTone[entry.kind]}`
                  }>
                  
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px]">
                    <span
                      className={`font-semibold ${
                      entry.kind === 'Approved' ?
                      'text-[#15803D]' :
                      entry.kind === 'Submitted for Approval' ?
                      'text-[#7C3AED]' :
                      entry.kind === 'Case Created' ?
                      'text-primary' :
                      'text-ink'}`
                      }>
                      
                      {entry.kind}
                    </span>{' '}
                    <span className="text-muted">{entry.actor}</span>
                  </p>
                  <p className="mt-0.5 break-words text-[13px] text-muted">
                    {entry.detail}
                  </p>
                </div>
                <span className="shrink-0 text-micro text-muted tnum">
                  {relativeFromNow(entry.time)}
                </span>
              </li>);

          })}
        </ul>

        <p className="mt-3 border-t border-line pt-3 text-micro text-muted tnum">
          {quote.feed.length} total · {commentCount} comments · Since{' '}
          {shortDate(quote.updated)}
        </p>
      </Card>
    </div>);

}