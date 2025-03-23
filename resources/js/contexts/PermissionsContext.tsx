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
  userPermissions?: Record<string, boolean>;
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

// This creates a context that will be consumed by child components
export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // We don't call usePage() here - instead we'll use a consumer component
  const [userData, setUserData] = useState<User | null>(null);
  const [pagePermissions, setPagePermissions] = useState<Record<string, boolean>>({});

  const can = useCallback((permission: string): boolean => {
    console.log('Checking permission:', permission);
    console.log('User data:', userData);
    console.log('Page permissions:', pagePermissions);
    
    // First check format "module:action"
    if (permission.includes(':')) {
      const [module, action] = permission.split(':');
      
      // Check in page permissions first (from controller)
      if (pagePermissions && pagePermissions[action] === true) {
        return true;
      }
      
      // Then check in user permissions array (from auth)
      if (userData?.permissions?.includes(permission)) {
        return true;
      }
    } 
    // If just checking for a simple permission key
    else if (pagePermissions && pagePermissions[permission] === true) {
      return true;
    }
    
    return false;
  }, [userData, pagePermissions]);

  const hasRole = useCallback((role: string): boolean => {
    if (!userData) return false;
    return userData.roles?.includes(role) ?? false;
  }, [userData]);

  const hasModuleAccess = useCallback((module: string): boolean => {
    if (!userData) return false;
    return userData.module_access?.[module] ?? false;
  }, [userData]);

  return (
    <PermissionsContext.Provider 
      value={{ 
        can, 
        hasRole, 
        hasModuleAccess 
      }}
    >
      <PermissionsDataLoader 
        setUserData={setUserData}
        setPagePermissions={setPagePermissions}
      >
        {children}
      </PermissionsDataLoader>
    </PermissionsContext.Provider>
  );
};

// This component will safely use the usePage() hook within an Inertia component context
const PermissionsDataLoader: React.FC<{ 
  children: React.ReactNode;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
  setPagePermissions: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}> = ({ children, setUserData, setPagePermissions }) => {
  try {
    // usePage is only called inside an Inertia component where it's safe
    const { auth, userPermissions } = usePage<CustomPageProps>().props;
    
    // Update state when props change
    useEffect(() => {
      console.log('Auth data loaded:', auth?.user);
      console.log('Page permissions loaded:', userPermissions);
      
      setUserData(auth?.user || null);
      setPagePermissions(userPermissions || {});
    }, [auth, userPermissions]);
    
    // Just render children - data loading is handled in the effect
    return <>{children}</>;
  } catch (error) {
    // If we're not in an Inertia context, just render children
    console.warn('PermissionsDataLoader: Not running in Inertia context', error);
    return <>{children}</>;
  }
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};