import React from 'react';
import { usePage } from '@inertiajs/react';

interface PermissionCheckerProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// This is a much simpler, direct implementation
export const PermissionChecker = ({ permission, children, fallback = null }: PermissionCheckerProps) => {
  // Get data directly from the page, no context needed
  const page = usePage().props;
  
  // Debug what permissions data we have
  console.log('Page props in PermissionChecker:', page);
  
  // Check for permission in different formats
  const hasPermission = React.useMemo(() => {
    // Check if action from "module:action" is in userPermissions
    if (permission.includes(':')) {
      const [module, action] = permission.split(':');
      
      // 1. Check in page-specific userPermissions (e.g., {update: true})
      if (page.userPermissions && page.userPermissions[action] === true) {
        console.log(`Permission granted via userPermissions[${action}]`);
        return true;
      }
      
      // 2. Check in auth.user.permissions array (e.g., ["user:update"])
      if (page.auth?.user?.permissions?.includes(permission)) {
        console.log(`Permission granted via auth.user.permissions array (${permission})`);
        return true;
      }
    }
    
    // 3. Also check if simple key exists in userPermissions
    if (page.userPermissions && page.userPermissions[permission] === true) {
      console.log(`Permission granted via direct userPermissions[${permission}]`);
      return true;
    }
    
    console.log(`Permission denied for: ${permission}`);
    return false;
  }, [permission, page]);
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default PermissionChecker;