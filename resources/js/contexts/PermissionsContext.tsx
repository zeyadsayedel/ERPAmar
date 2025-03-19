import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';

interface User {
  permissions?: string[];
  roles?: string[];
  module_access?: { [key: string]: boolean };
}

interface CustomPageProps extends PageProps {
  auth?: {
    user?: User;
  };
}

interface PermissionsContextType {
  can: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasModuleAccess: (module: string) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType>({
  can: () => false,
  hasRole: () => false,
  hasModuleAccess: () => false,
});

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null);
  
  // Try to access Inertia page data, but wrap in try/catch to handle non-Inertia contexts
  useEffect(() => {
    try {
      const { auth } = usePage<CustomPageProps>().props;
      setUserData(auth?.user ?? null);
    } catch (error) {
      // Running outside of Inertia context
      console.warn('PermissionsProvider: Not running in Inertia context');
    }
  }, []);

  const can = useCallback((permission: string) => {
    if (!userData) return false;
    return userData.permissions?.includes(permission) ?? false;
  }, [userData]);

  const hasRole = useCallback((role: string) => {
    if (!userData) return false;
    return userData.roles?.includes(role) ?? false;
  }, [userData]);

  const hasModuleAccess = useCallback((module: string) => {
    if (!userData) return false;
    return userData.module_access?.[module] ?? false;
  }, [userData]);

  return (
    <PermissionsContext.Provider value={{ can, hasRole, hasModuleAccess }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};