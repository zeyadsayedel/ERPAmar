import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Role } from '@/types/role';

interface RolesContextType {
  roles: Role[];
  hasRole: (roleName: string) => boolean;
  isAdmin: () => boolean;
  getHighestRole: () => Role | undefined;
}

const defaultContextValue: RolesContextType = {
  roles: [],
  hasRole: () => false,
  isAdmin: () => false,
  getHighestRole: () => undefined
};

const RolesContext = createContext<RolesContextType>(defaultContextValue);

export const RolesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>([]);

  // Safely try to use the Inertia context
  useEffect(() => {
    try {
      const { auth } = usePage<{ auth: { user: { roles: Role[] } } }>().props;
      setRoles(auth?.user?.roles || []);
    } catch (error) {
      // Not in Inertia context
      console.warn('RolesProvider: Not running in Inertia context');
    }
  }, []);

  const hasRole = useCallback((roleName: string) => {
    return roles.some((role: Role) => role.name === roleName);
  }, [roles]);

  const isAdmin = useCallback(() => {
    return hasRole('admin') || hasRole('super-admin');
  }, [hasRole]);

  const getHighestRole = useCallback(() => {
    const roleHierarchy = ['user', 'manager', 'admin', 'super-admin'];
    return roles.reduce((highest: Role | undefined, current: Role) => {
      if (!highest) return current;
      return roleHierarchy.indexOf(current.name) > roleHierarchy.indexOf(highest.name) 
        ? current 
        : highest;
    }, undefined);
  }, [roles]);

  return (
    <RolesContext.Provider value={{ roles, hasRole, isAdmin, getHighestRole }}>
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
};