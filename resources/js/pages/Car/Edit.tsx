import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CarForm from '@/components/Car/CarForm';
import { type Car, type CarFormData } from '@/types/car';

interface Props {
  car: Car;
}

export default function Edit({ car }: Props) {
  return (
    <AppLayout>
      <Head title={`Edit Car - ${car.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-background overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Edit Car - {car.name}</h2>
              <CarForm
                initialValues={car}
                onSubmit={(data: CarFormData) => {
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