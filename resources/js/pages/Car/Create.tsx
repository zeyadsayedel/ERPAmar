import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CarForm from '@/components/Car/CarForm';

export default function Create() {
  return (
    <AppLayout>
      <Head title="Create Car" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Create Car</h2>
              <CarForm
                onSubmit={(data) => {
                  router.post(route('cars.store'), data);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}