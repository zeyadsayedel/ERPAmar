export interface CarContractor {
  data: CarContractor;
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  cars?: Array<Car>;
  quarries?: Array<Quarry>;
  customers?: Array<CustomerAccount>;
  supplyClients?: Array<SupplyClient>;
  invoices?: Array<Invoice>;
}

export interface CarContractorFormData {
  name: string;
  car_ids?: number[];
  quarry_ids?: number[];
  customer_ids?: number[];
  supply_client_ids?: number[];
}

// Related types needed for relationships
export interface Car {
  id: number;
  name: string;
  car_load?: string;
  // Add other car fields as needed
}

export interface Quarry {
  id: number;
  name: string;
  // Add other quarry fields as needed
}

export interface CustomerAccount {
  id: number;
  name: string;
  // Add other customer fields as needed
}

export interface SupplyClient {
  id: number;
  name: string;
  // Add other supply client fields as needed
}

export interface Invoice {
  id: number;
  invoice_number: string;
  contractor_id: number;
  // Add other invoice fields as needed
}