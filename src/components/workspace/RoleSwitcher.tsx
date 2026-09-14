import React from 'react';
import { UserIcon } from 'lucide-react';
import { Card } from '../ui/Card';

interface RoleSwitcherProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

const roles = ['Actuary', 'Actuary Lead', 'Manager', 'SLT Lead'];

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps): JSX.Element {
  return (
    <Card>
      <div>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <UserIcon className="h-4 w-4" strokeWidth={2} />
          Role Preview
        </p>
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 ease-out ${
                currentRole === role
                  ? 'bg-primary text-white'
                  : 'border border-line bg-white text-ink hover:bg-canvas'
              }`}>
              {role}
            </button>
          ))}
        </div>
        <p className="mt-2 text-micro text-muted">
          Currently viewing as: <span className="font-semibold">{currentRole}</span>
        </p>
      </div>
    </Card>
  );
}
