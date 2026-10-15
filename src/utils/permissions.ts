export type Role = 'ADMIN' | 'PRE_SALES' | 'ACTUARY' | 'ACT_LEAD' | 'ACT_MGR' | 'SR_LEAD' | 'REVIEWER';

export type Permission =
'create' |
'edit' |
'runPricing' |
'submit' |
'approveLead' |
'approveManager' |
'finalApproval' |
'reject' |
'sendEvidence';

// Roles kept in the matrix but hidden from the "View as" dropdown in this prototype.
export const hiddenRoles: Role[] = ['ADMIN', 'PRE_SALES', 'REVIEWER'];

export const roles: {id: Role;label: string;short: string;}[] = [
{ id: 'ADMIN', label: 'Admin', short: 'Admin' },
{ id: 'PRE_SALES', label: 'Pre-Sales', short: 'Pre-Sales' },
{ id: 'ACTUARY', label: 'Actuary', short: 'Actuary' },
{ id: 'ACT_LEAD', label: 'Actuary Lead', short: 'Act Lead' },
{ id: 'ACT_MGR', label: 'Actuary Manager', short: 'Act Mgr' },
{ id: 'SR_LEAD', label: 'SLT', short: 'SLT' },
{ id: 'REVIEWER', label: 'Reviewer', short: 'Reviewer' }];


export const roleLabel = (r: Role): string => roles.find((x) => x.id === r)?.label ?? r;

export const permissionRows: {id: Permission;label: string;description: string;}[] = [
{ id: 'create', label: 'Create Quotes', description: 'Create new pricing cases via the wizard' },
{ id: 'edit', label: 'Edit Case Design', description: 'Modify parameters, upload census, change product' },
{ id: 'runPricing', label: 'Run Pricing Engine', description: 'Execute pricing engine and generate results' },
{ id: 'submit', label: 'Submit for Review', description: 'Submit case to next approval stage' },
{ id: 'approveLead', label: 'Approve (Lead)', description: 'Approve case at Actuary Lead stage' },
{ id: 'approveManager', label: 'Approve (Manager)', description: 'Approve case at Actuary Manager stage' },
{ id: 'finalApproval', label: 'Final Approval', description: 'Final sign-off on case quote' },
{ id: 'reject', label: 'Decline / Return', description: 'Decline case back to Actuary with comments' },
{ id: 'sendEvidence', label: 'Send Evidence Packet', description: 'Send approved packet to Senior Leadership' }];


const matrix: Record<Role, Permission[]> = {
  ADMIN: ['create', 'edit', 'runPricing', 'submit', 'approveLead', 'approveManager', 'finalApproval', 'reject', 'sendEvidence'],
  PRE_SALES: ['create', 'edit', 'submit'],
  ACTUARY: ['create', 'edit', 'runPricing', 'submit', 'sendEvidence'],
  ACT_LEAD: ['create', 'edit', 'runPricing', 'approveLead', 'reject'],
  ACT_MGR: ['create', 'edit', 'runPricing', 'approveManager', 'reject'],
  SR_LEAD: ['finalApproval', 'reject'],
  REVIEWER: []
};

// Demo user signed in for each role, so approval history reads as different people.
export const roleUser: Record<Role, string> = {
  ADMIN: 'Kiran Yeligeti',
  PRE_SALES: 'Kiran Yeligeti',
  ACTUARY: 'Scott',
  ACT_LEAD: 'Daniel',
  ACT_MGR: 'Anna',
  SR_LEAD: 'Maria',
  REVIEWER: 'Kiran Yeligeti'
};

export const can = (role: Role, permission: Permission): boolean => matrix[role].includes(permission);

export const denyReason = (role: Role, permission: Permission): string | undefined =>
can(role, permission) ? undefined : `${roleLabel(role)} can't ${permissionRows.find((p) => p.id === permission)?.label.toLowerCase()}`;
