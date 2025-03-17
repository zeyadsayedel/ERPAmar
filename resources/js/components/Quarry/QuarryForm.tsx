import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

interface QuarryFormData {
  name: string;
  army_account: string;
  royalty_account: string;
  loader_account: string;
  army_status: boolean;
  calculate_loader_hours: string;
  quarry_case: boolean;
  company_smoke_account_for_tractor: string;
  tractor_loaders_smoke: string;
  tractor_sand_transfer_price: string;
  trilla_sand_transfer_price: string;
  faradani_sand_transfer_price: string;
  faradani_double_sand_transfer_price: string;
  farm_tractor_sand_transfer_price: string;
  trilla_loaders_smoke: string;
  faradani_loaders_smoke: string;
  faradani_double_loaders_smoke: string;
  farm_tractor_loaders_smoke: string;
  company_smoke_account_for_trilla: string;
  company_smoke_account_for_faradani: string;
  company_smoke_account_for_faradani_double: string;
  company_smoke_account_for_farm_tractor: string;
  tractor_soil_transfer_price: string;
  trilla_soil_transfer_price: string;
  faradani_soil_transfer_price: string;
  faradani_double_soil_transfer_price: string;
  farm_tractor_soil_transfer_price: string;
  tractor_zalat_transfer_price: string;
  trilla_zalat_transfer_price: string;
  faradani_zalat_transfer_price: string;
  faradani_double_zalat_transfer_price: string;
  farm_tractor_zalat_transfer_price: string;
  tractor_rubble_transfer_price: string;
  trilla_rubble_transfer_price: string;
  faradani_rubble_transfer_price: string;
  faradani_double_rubble_transfer_price: string;
  farm_tractor_rubble_transfer_price: string;
  royalty_status: boolean;
  loader_hours_status: boolean;
  printed: string;
  unit: string;
  code: string;
}

interface QuarryFormProps {
  initialValues?: Partial<QuarryFormData>;
  onSubmit: (data: QuarryFormData) => void;
}

export default function QuarryForm({ initialValues, onSubmit }: QuarryFormProps) {
  const { data, setData, errors, processing } = useForm<QuarryFormData>({
    name: initialValues?.name || '',
    army_account: initialValues?.army_account?.toString() || '',
    royalty_account: initialValues?.royalty_account?.toString() || '',
    loader_account: initialValues?.loader_account?.toString() || '',
    army_status: initialValues?.army_status || false,
    calculate_loader_hours: initialValues?.calculate_loader_hours?.toString() || '',
    quarry_case: initialValues?.quarry_case || false,
    company_smoke_account_for_tractor: initialValues?.company_smoke_account_for_tractor?.toString() || '',
    tractor_loaders_smoke: initialValues?.tractor_loaders_smoke?.toString() || '',
    tractor_sand_transfer_price: initialValues?.tractor_sand_transfer_price?.toString() || '',
    trilla_sand_transfer_price: initialValues?.trilla_sand_transfer_price?.toString() || '',
    faradani_sand_transfer_price: initialValues?.faradani_sand_transfer_price?.toString() || '',
    faradani_double_sand_transfer_price: initialValues?.faradani_double_sand_transfer_price?.toString() || '',
    farm_tractor_sand_transfer_price: initialValues?.farm_tractor_sand_transfer_price?.toString() || '',
    trilla_loaders_smoke: initialValues?.trilla_loaders_smoke?.toString() || '',
    faradani_loaders_smoke: initialValues?.faradani_loaders_smoke?.toString() || '',
    faradani_double_loaders_smoke: initialValues?.faradani_double_loaders_smoke?.toString() || '',
    farm_tractor_loaders_smoke: initialValues?.farm_tractor_loaders_smoke?.toString() || '',
    company_smoke_account_for_trilla: initialValues?.company_smoke_account_for_trilla?.toString() || '',
    company_smoke_account_for_faradani: initialValues?.company_smoke_account_for_faradani?.toString() || '',
    company_smoke_account_for_faradani_double: initialValues?.company_smoke_account_for_faradani_double?.toString() || '',
    company_smoke_account_for_farm_tractor: initialValues?.company_smoke_account_for_farm_tractor?.toString() || '',
    tractor_soil_transfer_price: initialValues?.tractor_soil_transfer_price?.toString() || '',
    trilla_soil_transfer_price: initialValues?.trilla_soil_transfer_price?.toString() || '',
    faradani_soil_transfer_price: initialValues?.faradani_soil_transfer_price?.toString() || '',
    faradani_double_soil_transfer_price: initialValues?.faradani_double_soil_transfer_price?.toString() || '',
    farm_tractor_soil_transfer_price: initialValues?.farm_tractor_soil_transfer_price?.toString() || '',
    tractor_zalat_transfer_price: initialValues?.tractor_zalat_transfer_price?.toString() || '',
    trilla_zalat_transfer_price: initialValues?.trilla_zalat_transfer_price?.toString() || '',
    faradani_zalat_transfer_price: initialValues?.faradani_zalat_transfer_price?.toString() || '',
    faradani_double_zalat_transfer_price: initialValues?.faradani_double_zalat_transfer_price?.toString() || '',
    farm_tractor_zalat_transfer_price: initialValues?.farm_tractor_zalat_transfer_price?.toString() || '',
    tractor_rubble_transfer_price: initialValues?.tractor_rubble_transfer_price?.toString() || '',
    trilla_rubble_transfer_price: initialValues?.trilla_rubble_transfer_price?.toString() || '',
    faradani_rubble_transfer_price: initialValues?.faradani_rubble_transfer_price?.toString() || '',
    faradani_double_rubble_transfer_price: initialValues?.faradani_double_rubble_transfer_price?.toString() || '',
    farm_tractor_rubble_transfer_price: initialValues?.farm_tractor_rubble_transfer_price?.toString() || '',
    royalty_status: initialValues?.royalty_status || false,
    loader_hours_status: initialValues?.loader_hours_status || false,
    printed: initialValues?.printed?.toString() || '',
    unit: initialValues?.unit || '',
    code: initialValues?.code || '',
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  const renderNumericField = (id: keyof QuarryFormData, label: string) => (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        step="0.01"
        value={data[id]}
        onChange={e => setData(id, e.target.value)}
      />
      <InputError message={errors[id]} />
    </div>
  );

  const renderBooleanField = (id: keyof QuarryFormData, label: string) => (
    <div className="flex items-center justify-between">
      <Label htmlFor={id}>{label}</Label>
      <Switch
        id={id}
        checked={data[id] as boolean}
        onCheckedChange={checked => setData(id, checked)}
      />
      <InputError message={errors[id]} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="sand">Sand Transfer</TabsTrigger>
          <TabsTrigger value="soil">Soil Transfer</TabsTrigger>
          <TabsTrigger value="zalat">Zalat Transfer</TabsTrigger>
          <TabsTrigger value="rubble">Rubble Transfer</TabsTrigger>
          <TabsTrigger value="smoke">Smoke Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
            />
            <InputError message={errors.name} />
          </div>
          {renderNumericField('army_account', 'Army Account')}
          {renderNumericField('royalty_account', 'Royalty Account')}
          {renderNumericField('loader_account', 'Loader Account')}
          {renderBooleanField('army_status', 'Army Status')}
          {renderNumericField('calculate_loader_hours', 'Calculate Loader Hours')}
          {renderBooleanField('quarry_case', 'Quarry Case')}
          <div className="grid gap-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={data.unit}
              onChange={e => setData('unit', e.target.value)}
            />
            <InputError message={errors.unit} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={data.code}
              onChange={e => setData('code', e.target.value)}
            />
            <InputError message={errors.code} />
          </div>
        </TabsContent>

        <TabsContent value="sand" className="space-y-4">
          {renderNumericField('tractor_sand_transfer_price', 'Tractor Sand Transfer Price')}
          {renderNumericField('trilla_sand_transfer_price', 'Trilla Sand Transfer Price')}
          {renderNumericField('faradani_sand_transfer_price', 'Faradani Sand Transfer Price')}
          {renderNumericField('faradani_double_sand_transfer_price', 'Faradani Double Sand Transfer Price')}
          {renderNumericField('farm_tractor_sand_transfer_price', 'Farm Tractor Sand Transfer Price')}
        </TabsContent>

        <TabsContent value="soil" className="space-y-4">
          {renderNumericField('tractor_soil_transfer_price', 'Tractor Soil Transfer Price')}
          {renderNumericField('trilla_soil_transfer_price', 'Trilla Soil Transfer Price')}
          {renderNumericField('faradani_soil_transfer_price', 'Faradani Soil Transfer Price')}
          {renderNumericField('faradani_double_soil_transfer_price', 'Faradani Double Soil Transfer Price')}
          {renderNumericField('farm_tractor_soil_transfer_price', 'Farm Tractor Soil Transfer Price')}
        </TabsContent>

        <TabsContent value="zalat" className="space-y-4">
          {renderNumericField('tractor_zalat_transfer_price', 'Tractor Zalat Transfer Price')}
          {renderNumericField('trilla_zalat_transfer_price', 'Trilla Zalat Transfer Price')}
          {renderNumericField('faradani_zalat_transfer_price', 'Faradani Zalat Transfer Price')}
          {renderNumericField('faradani_double_zalat_transfer_price', 'Faradani Double Zalat Transfer Price')}
          {renderNumericField('farm_tractor_zalat_transfer_price', 'Farm Tractor Zalat Transfer Price')}
        </TabsContent>

        <TabsContent value="rubble" className="space-y-4">
          {renderNumericField('tractor_rubble_transfer_price', 'Tractor Rubble Transfer Price')}
          {renderNumericField('trilla_rubble_transfer_price', 'Trilla Rubble Transfer Price')}
          {renderNumericField('faradani_rubble_transfer_price', 'Faradani Rubble Transfer Price')}
          {renderNumericField('faradani_double_rubble_transfer_price', 'Faradani Double Rubble Transfer Price')}
          {renderNumericField('farm_tractor_rubble_transfer_price', 'Farm Tractor Rubble Transfer Price')}
        </TabsContent>

        <TabsContent value="smoke" className="space-y-4">
          {renderNumericField('company_smoke_account_for_tractor', 'Company Smoke Account for Tractor')}
          {renderNumericField('tractor_loaders_smoke', 'Tractor Loaders Smoke')}
          {renderNumericField('trilla_loaders_smoke', 'Trilla Loaders Smoke')}
          {renderNumericField('faradani_loaders_smoke', 'Faradani Loaders Smoke')}
          {renderNumericField('faradani_double_loaders_smoke', 'Faradani Double Loaders Smoke')}
          {renderNumericField('farm_tractor_loaders_smoke', 'Farm Tractor Loaders Smoke')}
          {renderNumericField('company_smoke_account_for_trilla', 'Company Smoke Account for Trilla')}
          {renderNumericField('company_smoke_account_for_faradani', 'Company Smoke Account for Faradani')}
          {renderNumericField('company_smoke_account_for_faradani_double', 'Company Smoke Account for Faradani Double')}
          {renderNumericField('company_smoke_account_for_farm_tractor', 'Company Smoke Account for Farm Tractor')}
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          {renderBooleanField('royalty_status', 'Royalty Status')}
          {renderBooleanField('loader_hours_status', 'Loader Hours Status')}
          {renderNumericField('printed', 'Printed')}
        </div>

        <Button type="submit" disabled={processing}>
          {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {initialValues ? 'Update Quarry' : 'Create Quarry'}
        </Button>
      </div>
    </form>
  );
}