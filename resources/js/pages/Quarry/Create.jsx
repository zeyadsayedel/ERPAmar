import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import QuarryForm from "@/Components/Quarry/QuarryForm";
import AppLayout from "@/Layouts/AppLayout";

export default function Create() {
  const handleSubmit = (data) => {
    router.post(route("quarries.store"), data);
  };

  return (
    <AppLayout>
      <Head title="Create Quarry" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Create Quarry</h2>
              </div>

              <QuarryForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}