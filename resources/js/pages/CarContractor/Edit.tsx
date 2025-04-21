import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Car, CarContractor, CarContractorFormData, CustomerAccount, Quarry, SupplyClient } from '@/types/car-contractor';

interface Props {
  contractor: CarContractor;
  cars: Car[];
  quarries: Quarry[];
  customers: CustomerAccount[];
  supplyClients: SupplyClient[];
}

export default function Edit({ contractor, cars = [], quarries = [], customers = [], supplyClients = [] }: Props) {
  // Add a check for contractor existence
  contractor = contractor.data;
  console.log('Contractor:', contractor);
  if (!contractor) {
    return (
      <AppLayout>
        <Head title="Error" />
        <div className="p-4 md:p-6 lg:p-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Error</CardTitle>
              <CardDescription>
                The contractor data could not be loaded.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>The requested contractor was not found or could not be loaded.</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.visit('/car-contractors')}
              >
                Return to Contractors
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const [formData, setFormData] = useState<CarContractorFormData>({
    name: contractor.name || '',
    car_ids: contractor.cars?.map(car => car.id) || [],
    quarry_ids: contractor.quarries?.map(quarry => quarry.id) || [],
    customer_ids: contractor.customers?.map(customer => customer.id) || [],
    supply_client_ids: contractor.supplyClients?.map(client => client.id) || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if contractor exists and has an ID before proceeding
    if (!contractor || !contractor.id) {
      console.error('Contractor or contractor ID is undefined');
      return;
    }
    
    // Direct URL approach
    router.put(`/car-contractors/${contractor.id}`, formData, {
      onError: (errors) => setErrors(errors),
      preserveScroll: true,
    });
  };

  const handleCarsChange = (selected: { value: number, label: string }[]) => {
    setFormData(prev => ({ ...prev, car_ids: selected.map(item => item.value) }));
  };

  const handleQuarriesChange = (selected: { value: number, label: string }[]) => {
    setFormData(prev => ({ ...prev, quarry_ids: selected.map(item => item.value) }));
  };

  const handleCustomersChange = (selected: { value: number, label: string }[]) => {
    setFormData(prev => ({ ...prev, customer_ids: selected.map(item => item.value) }));
  };

  const handleSupplyClientsChange = (selected: { value: number, label: string }[]) => {
    setFormData(prev => ({ ...prev, supply_client_ids: selected.map(item => item.value) }));
  };

  return (
    <AppLayout>
      <Head title={`Edit ${contractor.name}`} />

      <div className="p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Edit Car Contractor</CardTitle>
            <CardDescription>
              Update information for {contractor.name}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Relations Fields */}
                <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium">Relationships</h3>
                  
                  <div>
                    <Label htmlFor="cars">Cars</Label>
                    <MultiSelect
                      id="cars"
                      options={cars.map(car => ({ 
                        value: car.id, 
                        label: `${car.name} ${car.car_load ? `(${car.car_load})` : ''}`
                      }))}
                      defaultValue={contractor.cars?.map(car => ({
                        value: car.id,
                        label: `${car.name} ${car.car_load ? `(${car.car_load})` : ''}`
                      })) || []}
                      onChange={handleCarsChange}
                      className={errors.car_ids ? 'border-red-500' : ''}
                    />
                    {errors.car_ids && <p className="text-red-500 text-sm mt-1">{errors.car_ids}</p>}
                  </div>

                  <div>
                    <Label htmlFor="quarries">Quarries</Label>
                    <MultiSelect
                      id="quarries"
                      options={quarries.map(quarry => ({ value: quarry.id, label: quarry.name }))}
                      defaultValue={contractor.quarries?.map(quarry => ({
                        value: quarry.id,
                        label: quarry.name
                      })) || []}
                      onChange={handleQuarriesChange}
                      className={errors.quarry_ids ? 'border-red-500' : ''}
                    />
                    {errors.quarry_ids && <p className="text-red-500 text-sm mt-1">{errors.quarry_ids}</p>}
                  </div>

                  <div>
                    <Label htmlFor="customers">Customers</Label>
                    <MultiSelect
                      id="customers"
                      options={customers.map(customer => ({ value: customer.id, label: customer.name }))}
                      defaultValue={contractor.customers?.map(customer => ({
                        value: customer.id,
                        label: customer.name
                      })) || []}
                      onChange={handleCustomersChange}
                      className={errors.customer_ids ? 'border-red-500' : ''}
                    />
                    {errors.customer_ids && <p className="text-red-500 text-sm mt-1">{errors.customer_ids}</p>}
                  </div>

                  <div>
                    <Label htmlFor="supplyClients">Supply Clients</Label>
                    <MultiSelect
                      id="supplyClients"
                      options={supplyClients.map(client => ({ value: client.id, label: client.name }))}
                      defaultValue={contractor.supplyClients?.map(client => ({
                        value: client.id,
                        label: client.name
                      })) || []}
                      onChange={handleSupplyClientsChange}
                      className={errors.supply_client_ids ? 'border-red-500' : ''}
                    />
                    {errors.supply_client_ids && <p className="text-red-500 text-sm mt-1">{errors.supply_client_ids}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.visit(route('car-contractors.index'))}
              >
                Cancel
              </Button>
              <Button type="submit">Update Contractor</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}