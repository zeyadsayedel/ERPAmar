import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import QuarryForm from "@/Components/Quarry/QuarryForm";
import AppLayout from "@/Layouts/AppLayout";

export default function Edit({ quarry }) {
  const handleSubmit = (data) => {
    router.put(route("quarries.update", quarry.id), data);
  };

  return (
    <AppLayout>
      <Head title="Edit Quarry" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Edit Quarry</h2>
              </div>

              <QuarryForm 
                initialValues={quarry}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}