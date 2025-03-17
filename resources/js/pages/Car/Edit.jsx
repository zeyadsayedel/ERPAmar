import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import CarForm from "@/Components/Car/CarForm";
import AppLayout from "@/Layouts/AppLayout";

export default function Edit({ car }) {
  const handleSubmit = (data) => {
    router.put(route("cars.update", car.id), data);
  };

  return (
    <AppLayout>
      <Head title="Edit Car" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Edit Car</h2>
              </div>

              <CarForm 
                initialValues={car}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}