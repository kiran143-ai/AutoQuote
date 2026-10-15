import { can, roleLabel, roleUser, type Role } from './permissions';
import type { ApprovalStage, QuoteCase } from '../types';

export const stageLabel: Record<ApprovalStage, string> = {
  Draft: 'Actuary Review',
  Pricing: 'Actuary Review',
  Review: 'Actuary Lead Review',
  Approval: 'Manager Review',
  Final: 'SLT Lead Review',
  Approved: 'Approved'
};

export const stageOwnerLabel: Record<ApprovalStage, string> = {
  Draft: 'Actuary',
  Pricing: 'Actuary',
  Review: 'Actuary Lead',
  Approval: 'Actuary Manager',
  Final: 'SLT Lead',
  Approved: ''
};

const order: ApprovalStage[] = ['Draft', 'Pricing', 'Review', 'Approval', 'Final', 'Approved'];
export const nextStage = (s: ApprovalStage): ApprovalStage => order[Math.min(order.indexOf(s) + 1, order.length - 1)];

export interface StageAction {
  kind: 'submit' | 'approve';
  label: string;
}

export function primaryActionFor(role: Role, stage: ApprovalStage): StageAction | null {
  if ((stage === 'Draft' || stage === 'Pricing') && can(role, 'submit')) return { kind: 'submit', label: 'Send for Review' };
  if (stage === 'Review' && can(role, 'approveLead')) return { kind: 'approve', label: 'Approve' };
  if (stage === 'Approval' && can(role, 'approveManager')) return { kind: 'approve', label: 'Approve' };
  if (stage === 'Final' && can(role, 'finalApproval')) return { kind: 'approve', label: 'Final Approval' };
  return null;
}

export function canDeclineAt(role: Role, stage: ApprovalStage): boolean {
  if (!can(role, 'reject')) return false;
  if (stage === 'Review') return can(role, 'approveLead');
  if (stage === 'Approval') return can(role, 'approveManager');
  if (stage === 'Final') return can(role, 'finalApproval');
  return false;
}

export const stageOwnerRole: Partial<Record<ApprovalStage, Role>> = {
  Draft: 'ACTUARY',
  Pricing: 'ACTUARY',
  Review: 'ACT_LEAD',
  Approval: 'ACT_MGR',
  Final: 'SR_LEAD'
};

export const actorLabel = (role: Role): string => `${roleUser[role]} (${roleLabel(role)})`;

export const wasReturned = (c: QuoteCase): boolean =>
c.status === 'Declined' && c.approvalStage === 'Pricing' && c.resumeStage !== undefined;

export const isOpen = (c: QuoteCase): boolean => c.status === 'Draft' || c.status === 'Quoted' || wasReturned(c);

export function lastActivity(c: QuoteCase): string {
  return c.feed[c.feed.length - 1]?.time ?? new Date().toISOString();
}

export function pendingDays(c: QuoteCase): number {
  return Math.max(0, Math.floor((Date.now() - new Date(lastActivity(c)).getTime()) / 86_400_000));
}

export const pendingText = (days: number): string =>
days === 0 ? 'Pending today' : `Pending ${days} day${days === 1 ? '' : 's'}`;

