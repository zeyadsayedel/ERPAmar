import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SupplyClientForm from '@/components/SupplyClient/SupplyClientForm';
import { SupplyClient, SupplyClientFormData } from '@/types/supply-client';

interface Props {
  supplyClient: SupplyClient;
}

export default function Edit({ supplyClient }: Props) {
  return (
    <AppLayout>
      <Head title={`Edit ${supplyClient.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Edit Supply Client</CardTitle>
              <CardDescription>
                Update information for {supplyClient.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupplyClientForm
                initialValues={supplyClient}
                onSubmit={(data: SupplyClientFormData) => {
                  router.put(route('supply-clients.update', supplyClient.id), data);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}