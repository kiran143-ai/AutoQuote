import React, { useState } from 'react';
import { CheckIcon, XIcon, Mail } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useCaseStore } from '../../contexts/CaseStore';
import { premiumShort } from '../../utils/format';
import type { QuoteCase } from '../../types';

interface ApprovalActionsProps {
  quote: QuoteCase;
  currentRole: string;
}

const roleHierarchy: Record<string, string> = {
  'Draft': 'Actuary',
  'Pricing': 'Actuary Lead',
  'Review': 'Actuary Lead',
  'Approval': 'Manager',
  'Final': 'SLT Lead'
};

const nextRole: Record<string, string> = {
  'Draft': 'Actuary Lead',
  'Pricing': 'Actuary Lead',
  'Review': 'Manager',
  'Approval': 'SLT Lead',
  'Final': 'System'
};

export function ApprovalActions({ quote, currentRole }: ApprovalActionsProps): JSX.Element {
  const { advanceApproval } = useCaseStore();
  const [comment, setComment] = useState('');
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredRole = roleHierarchy[quote.approvalStage];
  const isCurrentApprover = requiredRole === currentRole;
  const isApproved = quote.approvalStage === 'Approved';
  const isActuary = currentRole === 'Actuary' && quote.approvalStage === 'Draft';

  // Email content for sending to next approver
  const emailContent = {
    to: `${nextRole[quote.approvalStage]}@company.com`,
    subject: `AutoQuote Approval Request: ${quote.name} - ${quote.client}`,
    body: `Hi ${nextRole[quote.approvalStage]},\n\nPlease review and approve the following quote:\n\nCase: ${quote.name}\nClient: ${quote.client}\nProduct: ${quote.product}\nPremium: ${premiumShort(quote.inputs.premium)}\nProducer: ${quote.producer}\n\nOpen the approval link:\nhttp://localhost:5175/quotes/${quote.id}/overview\n\nThank you,\n${currentRole}`
  };

  const handleApprove = () => {
    setIsSubmitting(true);
    advanceApproval(quote.id, comment);
    setComment('');
    setIsSubmitting(false);
  };

  const handleSendForReview = () => {
    setShowEmailPreview(true);
  };

  if (isApproved) {
    return (
      <Card accent="primary" className="border-t-2 border-t-success">
        <div className="flex items-center gap-3">
          <CheckIcon className="h-5 w-5 text-success" strokeWidth={2} />
          <div>
            <p className="font-semibold text-ink">✓ Fully Approved</p>
            <p className="text-xs text-muted">Quote approved by all levels. Ready for implementation.</p>
          </div>
        </div>
      </Card>
    );
  }

  // Actuary sending for review
  if (isActuary) {
    return (
      <Card accent="primary">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink">Send for Approval</p>
            <div className="text-xs text-muted space-y-1">
              <p><span className="font-medium">Case:</span> {quote.name}</p>
              <p><span className="font-medium">Client:</span> {quote.client}</p>
              <p><span className="font-medium">Premium:</span> {premiumShort(quote.inputs.premium)}</p>
              <p><span className="font-medium">Next Approver:</span> Actuary Lead</p>
            </div>
          </div>

          <div>
            <label htmlFor="send-comment" className="mb-2 block text-xs font-medium text-muted">
              Add note for Actuary Lead (optional)
            </label>
            <textarea
              id="send-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Any notes or context for the Actuary Lead..."
              className="h-16 w-full rounded-md border border-line bg-white px-3 py-2 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {!showEmailPreview ? (
            <Button
              variant="primary"
              onClick={handleSendForReview}
              disabled={isSubmitting}
              icon={<Mail className="h-4 w-4" strokeWidth={1.75} />}>
              Send for Review via Outlook
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="rounded-md border border-line bg-canvas p-3 text-xs space-y-1">
                <p><span className="font-semibold">To:</span> {emailContent.to}</p>
                <p><span className="font-semibold">Subject:</span> {emailContent.subject}</p>
                <p><span className="font-semibold">Message Preview:</span></p>
                <p className="whitespace-pre-wrap text-muted">{emailContent.body}</p>
              </div>
              <p className="text-micro text-muted">Outlook will open with this content. Approver will receive the app link.</p>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    handleApprove();
                    setShowEmailPreview(false);
                  }}
                  icon={<Mail className="h-4 w-4" strokeWidth={1.75} />}>
                  Confirm & Send
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowEmailPreview(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Other approvers reviewing
  if (!isCurrentApprover) {
    return (
      <Card>
        <p className="text-sm text-muted">
          Awaiting approval from <span className="font-semibold text-ink">{requiredRole}</span>
        </p>
      </Card>
    );
  }

  // Approval review
  return (
    <Card accent="primary">
      <div className="space-y-4">
        <div className="space-y-2 rounded-md bg-primary-tint p-3">
          <p className="text-sm font-semibold text-primary">Review Required</p>
          <div className="text-xs space-y-1 text-primary/90">
            <p><span className="font-medium">Case:</span> {quote.name}</p>
            <p><span className="font-medium">Client:</span> {quote.client}</p>
            <p><span className="font-medium">Premium:</span> {premiumShort(quote.inputs.premium)}</p>
            <p><span className="font-medium">Submitted by:</span> {quote.producer}</p>
          </div>
        </div>

        <div>
          <label htmlFor="approval-comment" className="mb-2 block text-xs font-medium text-muted">
            Add comment (optional)
          </label>
          <textarea
            id="approval-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add notes or reasons for your decision..."
            className="h-16 w-full rounded-md border border-line bg-white px-3 py-2 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleApprove}
            disabled={isSubmitting}
            icon={<Mail className="h-4 w-4" strokeWidth={1.75} />}>
            Approve & Send
          </Button>
          <Button
            variant="danger"
            disabled={isSubmitting}
            icon={<XIcon className="h-4 w-4" strokeWidth={2} />}>
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
}
