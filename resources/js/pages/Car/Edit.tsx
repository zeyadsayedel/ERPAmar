import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CarForm from '@/components/Car/CarForm';

interface Car {
  id: number;
  name: string;
  car_load: number;
  type_of_car: string;
  car_load_supply: number;
}

interface Props {
  car: Car;
}

export default function Edit({ car }: Props) {
  return (
    <AppLayout>
      <Head title={`Edit Car - ${car.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Edit Car - {car.name}</h2>
              <CarForm
                initialValues={car}
                onSubmit={(data) => {
                  router.put(route('cars.update', car.id), data);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}