import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { can, denyReason, hiddenRoles, roles, type Permission, type Role } from '../utils/permissions';

interface RoleApi {
  role: Role;
  setRole: (r: Role) => void;
  can: (p: Permission) => boolean;
  deny: (p: Permission) => string | undefined;
}

const RoleContext = createContext<RoleApi | null>(null);
const KEY = 'autoquote-role';

function initialRole(): Role {
  try {
    const saved = window.localStorage.getItem(KEY) as Role | null;
    if (saved && roles.some((r) => r.id === saved) && !hiddenRoles.includes(saved)) return saved;
  } catch {
    // storage unavailable
  }
  return 'ACTUARY';
}

export function RoleProvider({ children }: {children: React.ReactNode;}): JSX.Element {
  const [role, setRoleState] = useState<Role>(initialRole);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    try {
      window.localStorage.setItem(KEY, r);
    } catch {
      // storage unavailable
    }
  }, []);

  const api = useMemo<RoleApi>(
    () => ({ role, setRole, can: (p) => can(role, p), deny: (p) => denyReason(role, p) }),
    [role, setRole]
  );

  return <RoleContext.Provider value={api}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleApi {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
