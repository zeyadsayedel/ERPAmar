// filepath: e:\refine\ERPAmar\resources\js\types\quarry.ts
import { CustomerAccount } from './customer-account';
import { CarContractor } from './car-contractor';

export interface Quarry {
  id: number;
  name: string;
  location?: string;
  type?: string;
  status?: 'active' | 'inactive';
  description?: string;
  created_at: string;
  updated_at: string;
  // Relations
  customers?: CustomerAccount[];
  contractors?: CarContractor[];
}

export interface QuarryFormData {
  name: string;
  location?: string;
  type?: string;
  status?: 'active' | 'inactive';
  description?: string;
  customer_ids?: number[];
  contractor_ids?: number[];
}
