// Type definitions for PaperInvoice and related entities

export interface PaperInvoice {
  id: number;
  quarry_id: number;
  invoice_date: string;
  user_id: number | null;
  total_count: number;
  total_meters: number;
  total_revenue: number;
  total_expenses: number;
  total_net: number;
  created_at: string;
  updated_at: string;
  quarry?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    name: string;
  };
  items?: PaperInvoiceItem[];
}

export interface PaperInvoiceItem {
  id?: number | null;
  paper_invoice_id: number | null;
  number: number;
  from: string | null;
  to: string | null;
  meters: number;
  client_type: string | null;
  revenue: number;
  expenses: number;
  statement: string | null;
  created_at?: string;
  updated_at?: string;
}
