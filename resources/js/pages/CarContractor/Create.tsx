import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, CarContractorFormData, CustomerAccount, Quarry, SupplyClient } from '@/types/car-contractor';
import { MultiSelect } from '@/components/ui/multi-select';

interface Props {
  cars: Car[];
  quarries: Quarry[];
  customers: CustomerAccount[];
  supplyClients: SupplyClient[];
  userPermissions?: Record<string, boolean>;
}

export default function Create({ cars, quarries, customers, supplyClients }: Props) {
  const [formData, setFormData] = useState<CarContractorFormData>({
    name: '',
    car_ids: [],
    quarry_ids: [],
    customer_ids: [],
    supply_client_ids: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(route('car-contractors.store'), formData, {
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
      <Head title="Create Car Contractor" />

      <div className="p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Create Car Contractor</CardTitle>
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
              <Button type="submit">Create Contractor</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
