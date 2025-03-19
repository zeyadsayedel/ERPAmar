import React, { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';

interface PermissionCheckerProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

interface PageProps {
  auth: {
    user: {
      permissions?: string[];
    };
  };
}

/**
 * Component to conditionally render content based on user permissions
 */
export const PermissionChecker: React.FC<PermissionCheckerProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const { auth } = usePage<PageProps>().props;
  const { user } = auth;
  
  // If no user is authenticated, always hide the content
  if (!user) {
    return null;
  }
  
  // If no permissions are provided in page props, fall back to checking
  // module permissions by naming convention
  if (!user.permissions) {
    // Get permissions from the module:action format
    const [module, action] = permission.split(':');
    
    // If module permissions are provided in shared data
    if (user.module_access && user.module_access[module] && user.module_access[module].has_access) {
      return <>{children}</>;
    }
    
    return <>{fallback}</>;
  }
  
  // Check if the user has the specified permission
  const hasPermission = user.permissions.includes(permission);
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

/**
 * Component to conditionally render content based on user roles
 */
interface RoleCheckerProps {
  role: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleChecker: React.FC<RoleCheckerProps> = ({
  role,
  children,
  fallback = null,
}) => {
  const { auth } = usePage<PageProps>().props;
  const { user } = auth;
  
  // If no user is authenticated, always hide the content
  if (!user || !user.roles) {
    return null;
  }
  
  // Convert single role to array
  const rolesToCheck = Array.isArray(role) ? role : [role];
  
  // Check if the user has any of the specified roles
  const hasRole = rolesToCheck.some(r => user.roles.includes(r));
  
  return hasRole ? <>{children}</> : <>{fallback}</>;
};

export default PermissionChecker;
