
export interface Invoice {
  id: number;
  invoice_number: string;
  cashier_id: number;
  cashier?: { id: number; name: string };
  quarry_id: number;
  quarry?: { id: number; name: string };
  invoice_type: string;
  customer_id: number;
  customer?: { id: number; name: string };
  customer_car_id?: number;
  customerCar?: { id: number; name: string };
  unit: string;
  contractor_id?: number;
  contractor?: { id: number; name: string };
  custody: number;
  the_items: string;
  item_price: number;
  total: number;
  quantity: number;
  flag: number;
  supply: boolean;
  start_day: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface InvoiceFormData {
  cashier_id?: number;
  quarry_id?: number;
  invoice_type: string;
  customer_id: number;
  customer_car_id?: number;
  unit: string;
  contractor_id?: number;
  custody?: number;
  the_items: string;
  item_price?: number;
  total?: number;
  quantity?: number;
  flag?: number;
  supply: boolean;
  start_day: boolean;
}