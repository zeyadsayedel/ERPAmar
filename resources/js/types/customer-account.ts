import { Invoice } from './invoice';
import { CarContractor } from './car-contractor';
import { Quarry } from './quarry';

export interface CustomerAccount {
  id: number;
  name: string;
    client_type?: string;
  walk_in_customer?: boolean;
  // Pricing fields
  sand_price?: number;
  soil_price?: number;
  zalat_price?: number;
  rubble_price?: number;
  // Vehicle-specific pricing
  tractor_sand_price?: number;
  trilla_sand_price?: number;
  faradani_sand_price?: number;
  faradani_double_sand_price?: number;
  farm_tractor_sand_price?: number;
  tractor_soil_price?: number;
  trilla_soil_price?: number;
  faradani_soil_price?: number;
  faradani_double_soil_price?: number;
  farm_tractor_soil_price?: number;
  tractor_zalat_price?: number;
  trilla_zalat_price?: number;
  faradani_zalat_price?: number;
  faradani_double_zalat_price?: number;
  farm_tractor_zalat_price?: number;
  tractor_rubble_price?: number;
  trilla_rubble_price?: number;
  faradani_rubble_price?: number;
  faradani_double_rubble_price?: number;
  farm_tractor_rubble_price?: number;
  created_at: string;
  updated_at: string;
  // Relations
  quarries?: Quarry[];
  contractors?: CarContractor[];
  invoices?: Invoice[];
}

export interface CustomerAccountFormData {
  name: string;
  client_type?: string;
  walk_in_customer?: boolean;
  // Pricing fields
  sand_price?: number | string;
  soil_price?: number | string;
  zalat_price?: number | string;
  rubble_price?: number | string;
  // Vehicle-specific pricing
  tractor_sand_price?: number | string;
  trilla_sand_price?: number | string;
  faradani_sand_price?: number | string;
  faradani_double_sand_price?: number | string;
  farm_tractor_sand_price?: number | string;
  tractor_soil_price?: number | string;
  trilla_soil_price?: number | string;
  faradani_soil_price?: number | string;
  faradani_double_soil_price?: number | string;
  farm_tractor_soil_price?: number | string;
  tractor_zalat_price?: number | string;
  trilla_zalat_price?: number | string;
  faradani_zalat_price?: number | string;
  faradani_double_zalat_price?: number | string;
  farm_tractor_zalat_price?: number | string;
  tractor_rubble_price?: number | string;
  trilla_rubble_price?: number | string;
  faradani_rubble_price?: number | string;
  faradani_double_rubble_price?: number | string;
  farm_tractor_rubble_price?: number | string;
  // Relations
  quarry_ids?: number[];
  contractor_ids?: number[];
  [key: string]: unknown; // Added index signature
}