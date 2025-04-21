import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SupplyClientForm from '@/components/SupplyClient/SupplyClientForm';
import { SupplyClientFormData } from '@/types/supply-client';

export default function Create() {
  return (
    <AppLayout>
      <Head title="Create Supply Client" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Supply Client</CardTitle>
              <CardDescription>
                Add a new supply client to your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupplyClientForm
                onSubmit={(data: SupplyClientFormData) => {
                  router.post(route('supply-clients.store'), data);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}