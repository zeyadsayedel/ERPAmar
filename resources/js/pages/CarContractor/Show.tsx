import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil } from 'lucide-react';
import { CarContractor } from '@/types/car-contractor';
import { PermissionChecker } from '@/components/Permission';
import { Badge } from '@/components/ui/badge';

interface Props {
  contractor: CarContractor;
  permissions?: Record<string, boolean>;
}

export default function Show({ contractor }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AppLayout>
      <Head title={contractor.name} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <Button variant="outline" onClick={() => router.visit(route('car-contractors.index'))} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contractors
            </Button>
            <PermissionChecker permission="car_contractor:update">
              <Button variant="outline" onClick={() => router.visit(route('car-contractors.edit', contractor.id))}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Contractor
              </Button>
            </PermissionChecker>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{contractor.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Related Cars */}
              {contractor.cars && contractor.cars.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Associated Cars</h3>
                  <div className="flex flex-wrap gap-2">
                    {contractor.cars.map((car) => (
                      <Badge key={car.id} variant="outline">
                        {car.name} {car.car_load ? `(${car.car_load})` : ''}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Quarries */}
              {contractor.quarries && contractor.quarries.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Associated Quarries</h3>
                  <div className="flex flex-wrap gap-2">
                    {contractor.quarries.map((quarry) => (
                      <Badge key={quarry.id} variant="outline">
                        {quarry.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Customers */}
              {contractor.customers && contractor.customers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Associated Customers</h3>
                  <div className="flex flex-wrap gap-2">
                    {contractor.customers.map((customer) => (
                      <Badge key={customer.id} variant="outline">
                        {customer.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Supply Clients */}
              {contractor.supplyClients && contractor.supplyClients.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Associated Supply Clients</h3>
                  <div className="flex flex-wrap gap-2">
                    {contractor.supplyClients.map((client) => (
                      <Badge key={client.id} variant="outline">
                        {client.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Invoices */}
              {contractor.invoices && contractor.invoices.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Invoices</h3>
                  <div className="flex flex-col gap-2">
                    {contractor.invoices.slice(0, 5).map((invoice) => (
                      <div key={invoice.id} className="p-2 border rounded-md">
                        Invoice #{invoice.invoice_number}
                      </div>
                    ))}
                    {contractor.invoices.length > 5 && (
                      <div className="text-sm text-gray-500 mt-1">
                        + {contractor.invoices.length - 5} more invoices
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No relationships message */}
              {(!contractor.cars || contractor.cars.length === 0) && 
               (!contractor.quarries || contractor.quarries.length === 0) && 
               (!contractor.customers || contractor.customers.length === 0) && 
               (!contractor.supplyClients || contractor.supplyClients.length === 0) && 
               (!contractor.invoices || contractor.invoices.length === 0) && (
                <div className="text-gray-500 italic">
                  No relationships defined for this contractor.
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t bg-gray-50 text-xs text-gray-500 flex justify-between">
              <span>Created: {formatDate(contractor.created_at)}</span>
              <span>Last Updated: {formatDate(contractor.updated_at)}</span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}