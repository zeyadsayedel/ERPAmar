export interface Car {
  id: number;
  name: string | null;
  car_load: number | null;
  type_of_car: string | null;
  car_load_supply: number | null;
  created_at?: string;
  updated_at?: string;
}

export type CarFormData = Record<string, string> & {
  name: string;
  car_load: string;
  type_of_car: string;
  car_load_supply: string;
}

export type CarErrors = {
  [K in keyof CarFormData]?: string;
}