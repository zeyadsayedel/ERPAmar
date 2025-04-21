import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil } from 'lucide-react';
import { SupplyClient } from '@/types/supply-client';
import { PermissionChecker } from '@/components/Permission';

interface Props {
  supplyClient: SupplyClient;
  permissions: Record<string, boolean>;
}

export default function Show({ supplyClient, permissions }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AppLayout>
      <Head title={supplyClient.name} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <Button variant="outline" onClick={() => router.visit(route('supply-clients.index'))} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Supply Clients
            </Button>
            <PermissionChecker permission="supply_client:update">
              <Button variant="outline" onClick={() => router.visit(route('supply-clients.edit', supplyClient.id))}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Supply Client
              </Button>
            </PermissionChecker>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{supplyClient.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supplyClient.contact_person && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
                    <p className="mt-1 text-sm text-gray-900">{supplyClient.contact_person}</p>
                  </div>
                )}

                {supplyClient.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1 text-sm text-gray-900">{supplyClient.phone}</p>
                  </div>
                )}

                {supplyClient.email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-sm text-gray-900">{supplyClient.email}</p>
                  </div>
                )}
                
                {supplyClient.supply_type && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Supply Type</h3>
                    <p className="mt-1 text-sm text-gray-900">{supplyClient.supply_type}</p>
                  </div>
                )}
              </div>

              {supplyClient.address && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{supplyClient.address}</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t bg-gray-50 text-xs text-gray-500 flex justify-between">
              <span>Created: {formatDate(supplyClient.created_at)}</span>
              <span>Last Updated: {formatDate(supplyClient.updated_at)}</span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}