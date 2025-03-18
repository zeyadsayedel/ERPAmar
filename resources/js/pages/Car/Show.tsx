import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil } from 'lucide-react';
import { type Car } from '@/types/car';

interface Props {
  car: Car;
}

export default function Show({ car }: Props) {
  return (
    <AppLayout>
      <Head title={`Car - ${car.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-background overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => router.visit(route('cars.index'))}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Cars
                  </Button>
                  <h2 className="text-2xl font-semibold">Car Details</h2>
                </div>
                <Button onClick={() => router.visit(route('cars.edit', car.id))}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Car
                </Button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="mt-1 text-sm text-gray-900">{car.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <p className="mt-1 text-sm text-gray-900">{car.type_of_car}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Car Load</h3>
                    <p className="mt-1 text-sm text-gray-900">{car.car_load}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Car Load Supply</h3>
                    <p className="mt-1 text-sm text-gray-900">{car.car_load_supply}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}