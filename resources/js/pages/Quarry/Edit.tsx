import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import QuarryForm from '@/components/Quarry/QuarryForm';

interface Quarry {
  id: number;
  name: string;
  army_account: number;
  royalty_account: number;
  loader_account: number;
  army_status: boolean;
  calculate_loader_hours: number;
  quarry_case: boolean;
  company_smoke_account_for_tractor: number;
  tractor_loaders_smoke: number;
  tractor_sand_transfer_price: number;
  trilla_sand_transfer_price: number;
  faradani_sand_transfer_price: number;
  faradani_double_sand_transfer_price: number;
  farm_tractor_sand_transfer_price: number;
  trilla_loaders_smoke: number;
  faradani_loaders_smoke: number;
  faradani_double_loaders_smoke: number;
  farm_tractor_loaders_smoke: number;
  company_smoke_account_for_trilla: number;
  company_smoke_account_for_faradani: number;
  company_smoke_account_for_faradani_double: number;
  company_smoke_account_for_farm_tractor: number;
  tractor_soil_transfer_price: number;
  trilla_soil_transfer_price: number;
  faradani_soil_transfer_price: number;
  faradani_double_soil_transfer_price: number;
  farm_tractor_soil_transfer_price: number;
  tractor_zalat_transfer_price: number;
  trilla_zalat_transfer_price: number;
  faradani_zalat_transfer_price: number;
  faradani_double_zalat_transfer_price: number;
  farm_tractor_zalat_transfer_price: number;
  tractor_rubble_transfer_price: number;
  trilla_rubble_transfer_price: number;
  faradani_rubble_transfer_price: number;
  faradani_double_rubble_transfer_price: number;
  farm_tractor_rubble_transfer_price: number;
  royalty_status: boolean;
  loader_hours_status: boolean;
  printed: number;
  unit: string;
  code: string;
}

interface Props {
  quarry: Quarry;
}

export default function Edit({ quarry }: Props) {
  return (
    <AppLayout>
      <Head title={`Edit Quarry - ${quarry.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Edit Quarry - {quarry.name}</h2>
              <QuarryForm
                initialValues={quarry}
                onSubmit={(data) => {
                  router.put(route('quarries.update', quarry.id), data);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}