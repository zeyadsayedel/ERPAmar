export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  module?: string | null;
  action?: string | null;
  display_name?: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionFormData {
  name: string;
  module?: string;
  action?: string;
  display_name?: string;
}

export type ModulePermissions = Record<string, Permission[]>;

export interface RegisterModuleFormData {
  name: string;
  capabilities: string[];
}