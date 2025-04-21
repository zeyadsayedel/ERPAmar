import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';
import { CustomerAccount, CustomerAccountFormData } from '@/types/customer-account';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Quarry } from '@/types/quarry';
import { CarContractor } from '@/types/car-contractor';
import { MultiSelect } from '@/components/ui/multi-select';

interface CustomerAccountFormProps {
  initialValues?: CustomerAccount;
  onSubmit: (data: CustomerAccountFormData) => void;
  quarries?: Quarry[];
  contractors?: CarContractor[];
}

export default function CustomerAccountForm({ initialValues, onSubmit, quarries = [], contractors = [] }: CustomerAccountFormProps) {
  const { data, setData, errors, processing } = useForm<CustomerAccountFormData>({
    name: initialValues?.name || '',
    client_type: initialValues?.client_type || '',
    walk_in_customer: initialValues?.walk_in_customer || false,
    // Base prices
    sand_price: initialValues?.sand_price?.toString() || '',
    soil_price: initialValues?.soil_price?.toString() || '',
    zalat_price: initialValues?.zalat_price?.toString() || '',
    rubble_price: initialValues?.rubble_price?.toString() || '',
    // Vehicle-specific sand prices
    tractor_sand_price: initialValues?.tractor_sand_price?.toString() || '',
    trilla_sand_price: initialValues?.trilla_sand_price?.toString() || '',
    faradani_sand_price: initialValues?.faradani_sand_price?.toString() || '',
    faradani_double_sand_price: initialValues?.faradani_double_sand_price?.toString() || '',
    farm_tractor_sand_price: initialValues?.farm_tractor_sand_price?.toString() || '',
    // Vehicle-specific soil prices
    tractor_soil_price: initialValues?.tractor_soil_price?.toString() || '',
    trilla_soil_price: initialValues?.trilla_soil_price?.toString() || '',
    faradani_soil_price: initialValues?.faradani_soil_price?.toString() || '',
    faradani_double_soil_price: initialValues?.faradani_double_soil_price?.toString() || '',
    farm_tractor_soil_price: initialValues?.farm_tractor_soil_price?.toString() || '',
    // Vehicle-specific zalat prices
    tractor_zalat_price: initialValues?.tractor_zalat_price?.toString() || '',
    trilla_zalat_price: initialValues?.trilla_zalat_price?.toString() || '',
    faradani_zalat_price: initialValues?.faradani_zalat_price?.toString() || '',
    faradani_double_zalat_price: initialValues?.faradani_double_zalat_price?.toString() || '',
    farm_tractor_zalat_price: initialValues?.farm_tractor_zalat_price?.toString() || '',
    // Vehicle-specific rubble prices
    tractor_rubble_price: initialValues?.tractor_rubble_price?.toString() || '',
    trilla_rubble_price: initialValues?.trilla_rubble_price?.toString() || '',
    faradani_rubble_price: initialValues?.faradani_rubble_price?.toString() || '',
    faradani_double_rubble_price: initialValues?.faradani_double_rubble_price?.toString() || '',
    farm_tractor_rubble_price: initialValues?.farm_tractor_rubble_price?.toString() || '',
    // Relations
    quarry_ids: initialValues?.quarries?.map(q => q.id) || [],
    contractor_ids: initialValues?.contractors?.map(c => c.id) || [],
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  const quarryOptions = quarries.map(quarry => ({
    value: quarry.id.toString(),
    label: quarry.name
  }));

  const contractorOptions = contractors.map(contractor => ({
    value: contractor.id.toString(),
    label: contractor.name
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Information</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                placeholder="Enter customer name"
                required
              />
              <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="client_type">Client Type</Label>
              <Select
                value={data.client_type || ''}
                onValueChange={(value) => setData('client_type', value)}
              >
                <SelectTrigger id="client_type">
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
              <InputError message={errors.client_type} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="walk_in_customer"
              checked={!!data.walk_in_customer}
              onCheckedChange={(checked) => setData('walk_in_customer', checked)}
            />
            <Label htmlFor="walk_in_customer">Walk-in Customer</Label>
            <InputError message={errors.walk_in_customer} />
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Base Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="sand_price">Sand Price</Label>
                <Input
                  id="sand_price"
                  type="number"
                  step="0.01"
                  value={data.sand_price || ''}
                  onChange={e => setData('sand_price', e.target.value)}
                  placeholder="Enter sand price"
                />
                <InputError message={errors.sand_price} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="soil_price">Soil Price</Label>
                <Input
                  id="soil_price"
                  type="number"
                  step="0.01"
                  value={data.soil_price || ''}
                  onChange={e => setData('soil_price', e.target.value)}
                  placeholder="Enter soil price"
                />
                <InputError message={errors.soil_price} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="zalat_price">Zalat Price</Label>
                <Input
                  id="zalat_price"
                  type="number"
                  step="0.01"
                  value={data.zalat_price || ''}
                  onChange={e => setData('zalat_price', e.target.value)}
                  placeholder="Enter zalat price"
                />
                <InputError message={errors.zalat_price} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rubble_price">Rubble Price</Label>
                <Input
                  id="rubble_price"
                  type="number"
                  step="0.01"
                  value={data.rubble_price || ''}
                  onChange={e => setData('rubble_price', e.target.value)}
                  placeholder="Enter rubble price"
                />
                <InputError message={errors.rubble_price} />
              </div>
            </div>
          </div>

          <Tabs defaultValue="sand" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="sand">Sand</TabsTrigger>
              <TabsTrigger value="soil">Soil</TabsTrigger>
              <TabsTrigger value="zalat">Zalat</TabsTrigger>
              <TabsTrigger value="rubble">Rubble</TabsTrigger>
            </TabsList>

            <TabsContent value="sand" className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Vehicle-specific Sand Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="tractor_sand_price">Tractor Sand Price</Label>
                  <Input
                    id="tractor_sand_price"
                    type="number"
                    step="0.01"
                    value={data.tractor_sand_price || ''}
                    onChange={e => setData('tractor_sand_price', e.target.value)}
                    placeholder="Enter tractor sand price"
                  />
                  <InputError message={errors.tractor_sand_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="trilla_sand_price">Trilla Sand Price</Label>
                  <Input
                    id="trilla_sand_price"
                    type="number"
                    step="0.01"
                    value={data.trilla_sand_price || ''}
                    onChange={e => setData('trilla_sand_price', e.target.value)}
                    placeholder="Enter trilla sand price"
                  />
                  <InputError message={errors.trilla_sand_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="faradani_sand_price">Faradani Sand Price</Label>
                  <Input
                    id="faradani_sand_price"
                    type="number"
                    step="0.01"
                    value={data.faradani_sand_price || ''}
                    onChange={e => setData('faradani_sand_price', e.target.value)}
                    placeholder="Enter faradani sand price"
                  />
                  <InputError message={errors.faradani_sand_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="faradani_double_sand_price">Faradani Double Sand Price</Label>
                  <Input
                    id="faradani_double_sand_price"
                    type="number"
                    step="0.01"
                    value={data.faradani_double_sand_price || ''}
                    onChange={e => setData('faradani_double_sand_price', e.target.value)}
                    placeholder="Enter faradani double sand price"
                  />
                  <InputError message={errors.faradani_double_sand_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="farm_tractor_sand_price">Farm Tractor Sand Price</Label>
                  <Input
                    id="farm_tractor_sand_price"
                    type="number"
                    step="0.01"
                    value={data.farm_tractor_sand_price || ''}
                    onChange={e => setData('farm_tractor_sand_price', e.target.value)}
                    placeholder="Enter farm tractor sand price"
                  />
                  <InputError message={errors.farm_tractor_sand_price} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="soil" className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Vehicle-specific Soil Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="tractor_soil_price">Tractor Soil Price</Label>
                  <Input
                    id="tractor_soil_price"
                    type="number"
                    step="0.01"
                    value={data.tractor_soil_price || ''}
                    onChange={e => setData('tractor_soil_price', e.target.value)}
                    placeholder="Enter tractor soil price"
                  />
                  <InputError message={errors.tractor_soil_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="trilla_soil_price">Trilla Soil Price</Label>
                  <Input
                    id="trilla_soil_price"
                    type="number"
                    step="0.01"
                    value={data.trilla_soil_price || ''}
                    onChange={e => setData('trilla_soil_price', e.target.value)}
                    placeholder="Enter trilla soil price"
                  />
                  <InputError message={errors.trilla_soil_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="faradani_soil_price">Faradani Soil Price</Label>
                  <Input
                    id="faradani_soil_price"
                    type="number"
                    step="0.01"
                    value={data.faradani_soil_price || ''}
                    onChange={e => setData('faradani_soil_price', e.target.value)}
                    placeholder="Enter faradani soil price"
                  />
                  <InputError message={errors.faradani_soil_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="faradani_double_soil_price">Faradani Double Soil Price</Label>
                  <Input
                    id="faradani_double_soil_price"
                    type="number"
                    step="0.01"
                    value={data.faradani_double_soil_price || ''}
                    onChange={e => setData('faradani_double_soil_price', e.target.value)}
                    placeholder="Enter faradani double soil price"
                  />
                  <InputError message={errors.faradani_double_soil_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="farm_tractor_soil_price">Farm Tractor Soil Price</Label>
                  <Input
                    id="farm_tractor_soil_price"
                    type="number"
                    step="0.01"
                    value={data.farm_tractor_soil_price || ''}
                    onChange={e => setData('farm_tractor_soil_price', e.target.value)}
                    placeholder="Enter farm tractor soil price"
                  />
                  <InputError message={errors.farm_tractor_soil_price} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="zalat" className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Vehicle-specific Zalat Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="tractor_zalat_price">Tractor Zalat Price</Label>
                  <Input
                    id="tractor_zalat_price"
                    type="number"
                    step="0.01"
                    value={data.tractor_zalat_price || ''}
                    onChange={e => setData('tractor_zalat_price', e.target.value)}
                    placeholder="Enter tractor zalat price"
                  />
                  <InputError message={errors.tractor_zalat_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="trilla_zalat_price">Trilla Zalat Price</Label>
                  <Input
                    id="trilla_zalat_price"
                    type="number"
                    step="0.01"
                    value={data.trilla_zalat_price || ''}
                    onChange={e => setData('trilla_zalat_price', e.target.value)}
                    placeholder="Enter trilla zalat price"
                  />
                  <InputError message={errors.trilla_zalat_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="faradani_zalat_price">Faradani Zalat Price</Label>
                  <Input
                    id="faradani_zalat_price"
                    type="number"
                    step="0.01"
                    value={data.faradani_zalat_price || ''}
                    onChange={e => setData('faradani_zalat_price', e.target.value)}
                    placeholder="Enter faradani zalat price"
                  />
                  <InputError message={errors.faradani_zalat_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="faradani_double_zalat_price">Faradani Double Zalat Price</Label>
                  <Input
                    id="faradani_double_zalat_price"
                    type="number"
                    step="0.01"
                    value={data.faradani_double_zalat_price || ''}
                    onChange={e => setData('faradani_double_zalat_price', e.target.value)}
                    placeholder="Enter faradani double zalat price"
                  />
                  <InputError message={errors.faradani_double_zalat_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="farm_tractor_zalat_price">Farm Tractor Zalat Price</Label>
                  <Input
                    id="farm_tractor_zalat_price"
                    type="number"
                    step="0.01"
                    value={data.farm_tractor_zalat_price || ''}
                    onChange={e => setData('farm_tractor_zalat_price', e.target.value)}
                    placeholder="Enter farm tractor zalat price"
                  />
                  <InputError message={errors.farm_tractor_zalat_price} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rubble" className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Vehicle-specific Rubble Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="tractor_rubble_price">Tractor Rubble Price</Label>
                  <Input
                    id="tractor_rubble_price"
                    type="number"
                    step="0.01"
                    value={data.tractor_rubble_price || ''}
                    onChange={e => setData('tractor_rubble_price', e.target.value)}
                    placeholder="Enter tractor rubble price"
                  />
                  <InputError message={errors.tractor_rubble_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="trilla_rubble_price">Trilla Rubble Price</Label>
                  <Input
                    id="trilla_rubble_price"
                    type="number"
                    step="0.01"
                    value={data.trilla_rubble_price || ''}
                    onChange={e => setData('trilla_rubble_price', e.target.value)}
                    placeholder="Enter trilla rubble price"
                  />
                  <InputError message={errors.trilla_rubble_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="faradani_rubble_price">Faradani Rubble Price</Label>
                  <Input
                    id="faradani_rubble_price"
                    type="number"
                    step="0.01"
                    value={data.faradani_rubble_price || ''}
                    onChange={e => setData('faradani_rubble_price', e.target.value)}
                    placeholder="Enter faradani rubble price"
                  />
                  <InputError message={errors.faradani_rubble_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="faradani_double_rubble_price">Faradani Double Rubble Price</Label>
                  <Input
                    id="faradani_double_rubble_price"
                    type="number"
                    step="0.01"
                    value={data.faradani_double_rubble_price || ''}
                    onChange={e => setData('faradani_double_rubble_price', e.target.value)}
                    placeholder="Enter faradani double rubble price"
                  />
                  <InputError message={errors.faradani_double_rubble_price} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="farm_tractor_rubble_price">Farm Tractor Rubble Price</Label>
                  <Input
                    id="farm_tractor_rubble_price"
                    type="number"
                    step="0.01"
                    value={data.farm_tractor_rubble_price || ''}
                    onChange={e => setData('farm_tractor_rubble_price', e.target.value)}
                    placeholder="Enter farm tractor rubble price"
                  />
                  <InputError message={errors.farm_tractor_rubble_price} />
                </div>
              </div>            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="quarry_ids">Associated Quarries</Label>
              <MultiSelect
                options={quarryOptions}
                value={data.quarry_ids?.map(id => ({
                  value: id.toString(),
                  label: quarries.find(q => q.id === id)?.name || id.toString()
                })) || []}
                onChange={selected => setData('quarry_ids', selected.map(item => parseInt(item.value.toString())))}
                placeholder="Select quarries"
              />
              <InputError message={errors.quarry_ids?.toString()} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contractor_ids">Associated Contractors</Label>
              <MultiSelect
                options={contractorOptions}
                value={data.contractor_ids?.map(id => ({
                  value: id.toString(),
                  label: contractors.find(c => c.id === id)?.name || id.toString()
                })) || []}
                onChange={selected => setData('contractor_ids', selected.map(item => parseInt(item.value.toString())))}
                placeholder="Select contractors"
              />
              <InputError message={errors.contractor_ids?.toString()} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit" disabled={processing}>
          {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {initialValues ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
}