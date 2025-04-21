export interface SupplyClient {
  id: number;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  supply_type?: string;
  created_at: string;
  updated_at: string;
}

export interface SupplyClientFormData {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  supply_type?: string;
}