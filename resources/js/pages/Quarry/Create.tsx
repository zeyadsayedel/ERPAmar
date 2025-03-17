import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import QuarryForm from '@/components/Quarry/QuarryForm';

export default function Create() {
  return (
    <AppLayout>
      <Head title="Create Quarry" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Create Quarry</h2>
              <QuarryForm
                onSubmit={(data) => {
                  router.post(route('quarries.store'), data);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}