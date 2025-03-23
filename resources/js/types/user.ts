import { Role, Permission } from './role';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  
  // WordPress legacy fields
  first_name?: string;
  last_name?: string;
  nickname?: string;
  user_login?: string;
  user_nicename?: string;
  user_url?: string;
  display_name?: string;
  description?: string;
  
  // Relations
  roles: Role[];
  permissions?: Permission[];
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  first_name?: string;
  last_name?: string;
  nickname?: string;
  roles: number[];
  permissions: number[];
}

export interface UserRolesSummary {
  id: number;
  name: string;
  email: string;
  roles: Array<{
    id: number;
    name: string;
  }>;
  direct_permissions: Array<{
    id: number;
    name: string;
  }>;
  all_permissions: Array<{
    id: number;
    name: string;
  }>;
}
