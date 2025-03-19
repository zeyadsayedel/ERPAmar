import React from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';

interface PermissionCheckerProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionChecker = ({ permission, children, fallback = null }: PermissionCheckerProps) => {
  const { can } = usePermissions();
  
  if (can(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default PermissionChecker;
