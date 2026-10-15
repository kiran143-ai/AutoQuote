import React from 'react';
import { Navigate } from 'react-router-dom';
import { CheckIcon, XIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/layout/PageHeader';
import { useRole } from '../contexts/RoleContext';
import { can, permissionRows, roles } from '../utils/permissions';

export function ActuarialAdminPage(): JSX.Element {
  const { role } = useRole();
  if (role !== 'ADMIN') return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-[1440px] p-6">
      <PageHeader title="Actuarial Admin" subtitle="Governance thresholds, gold standards, and user roles." />
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {['Governance Thresholds', 'Gold Standards'].map((panel) =>
          <Card key={panel} title={panel} meta="No data in this prototype">
              <div className="flex h-28 items-center justify-center rounded-md border border-dashed border-line bg-canvas text-xs text-muted">
                {panel} placeholder
              </div>
            </Card>
          )}
        </div>

        <Card accent="primary" title="Role Permissions Matrix" meta="What each role can do. Use View as in the top bar to try a role." padded={false}>
          <div className="overflow-x-auto border-t border-line">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-canvas text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                  <th scope="col" className="px-4 py-2.5 text-left">Permission</th>
                  <th scope="col" className="px-4 py-2.5 text-left">Description</th>
                  {roles.map((r) =>
                  <th key={r.id} scope="col" className={`px-3 py-2.5 text-center ${r.id === role ? 'bg-primary-tint text-primary' : ''}`}>
                      {r.short}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {permissionRows.map((p) =>
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-canvas/70">
                    <th scope="row" className="px-4 py-3 text-left text-[13px] font-semibold text-ink">{p.label}</th>
                    <td className="px-4 py-3 text-xs text-muted">{p.description}</td>
                    {roles.map((r) =>
                  <td key={r.id} className="px-3 py-3 text-center">
                        {can(r.id, p.id) ?
                    <>
                            <CheckIcon className="mx-auto h-4 w-4 text-success" strokeWidth={2.25} aria-hidden="true" />
                            <span className="sr-only">Allowed</span>
                          </> :

                    <>
                            <XIcon className="mx-auto h-4 w-4 text-danger" strokeWidth={2.25} aria-hidden="true" />
                            <span className="sr-only">Not allowed</span>
                          </>
                    }
                      </td>
                  )}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>);

}
