export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  module?: string;
  action?: string;
  display_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export type ModulePermissions = Record<string, Permission[]>;

export interface RoleFormData {
  name: string;
  permissions: number[];
}

export interface PermissionFormData {
  name: string;
}

export interface RegisterModuleData {
  module: string;
  actions: string[];
}

// Type for permissions that are grouped by module
export type PermissionsByModule = Record<string, Permission[]>;

// Type for user permissions (what actions they can perform)
export type UserPermissions = Record<string, boolean>;