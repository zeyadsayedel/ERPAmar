import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';
import { Invoice, InvoiceFormData } from '@/types/invoice';
import { CustomerAccount } from '@/types/customer-account';
import { CarContractor } from '@/types/car-contractor';
import { Quarry } from '@/types/quarry';
import { User } from '@/types/user';
import { Car } from '@/types/car';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InvoiceFormProps {
  initialValues?: Invoice;
  onSubmit: (data: InvoiceFormData) => void;
  customers: CustomerAccount[];
  cars?: Car[];
  contractors?: CarContractor[];
  quarries?: Quarry[];
  cashiers?: User[];
}

export default function InvoiceForm({ initialValues, onSubmit, customers = [], cars = [], contractors = [], quarries = [], cashiers = [] }: InvoiceFormProps) {
  const { data, setData, errors, processing } = useForm<InvoiceFormData>({
    cashier_id: initialValues?.cashier_id,
    quarry_id: initialValues?.quarry_id,
    invoice_type: initialValues?.invoice_type || 'postpaid',
    customer_id: initialValues?.customer_id || (customers.length > 0 ? customers[0].id : 0),
    customer_car_id: initialValues?.customer_car_id,
    unit: initialValues?.unit || 'car',
    contractor_id: initialValues?.contractor_id,
    custody: initialValues?.custody || 0,
    the_items: initialValues?.the_items || '',
    item_price: initialValues?.item_price || 0,
    total: initialValues?.total || 0,
    quantity: initialValues?.quantity || 0,
    flag: initialValues?.flag || 1, // Default to active
    supply: initialValues?.supply || false,
    start_day: initialValues?.start_day || false,
  });

  // Calculate total whenever item_price or quantity changes
  useEffect(() => {
    const calculatedTotal = (data.item_price || 0) * (data.quantity || 0);
    setData('total', calculatedTotal);
  }, [data.item_price, data.quantity]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  // Toggle between regular invoice and supply invoice
  const handleModeChange = (value: string) => {
    setData('supply', value === 'supply');
    // Clear contractor and custody fields when switching to regular invoice
    if (value !== 'supply') {
      setData('contractor_id', undefined);
      setData('custody', 0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Invoice Type Tabs */}
      <Tabs 
        defaultValue={data.supply ? 'supply' : 'invoice'} 
        onValueChange={handleModeChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="supply">Supply Invoice</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Always visible fields (Core to All Modes) */}
        {quarries && quarries.length > 0 && (
          <div className="grid gap-2">
            <Label htmlFor="quarry_id">Quarry</Label>
            <Select 
              value={data.quarry_id?.toString() || ''} 
              onValueChange={(value) => setData('quarry_id', value ? parseInt(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select quarry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Select quarry</SelectItem>
                {quarries.map(quarry => (
                  <SelectItem key={quarry.id} value={quarry.id.toString()}>
                    {quarry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={errors.quarry_id} />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="customer_id">Client</Label>
          <Select 
            value={data.customer_id?.toString() || ''} 
            onValueChange={(value) => setData('customer_id', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.length > 0 ? customers.map(customer => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.name}
                </SelectItem>
              )) : (
                <SelectItem value="0">No customers available</SelectItem>
              )}
            </SelectContent>
          </Select>
          <InputError message={errors.customer_id} />
        </div>

        {cars && cars.length > 0 && (
          <div className="grid gap-2">
            <Label htmlFor="customer_car_id">Car</Label>
            <Select 
              value={data.customer_car_id?.toString() || ''} 
              onValueChange={(value) => setData('customer_car_id', value ? parseInt(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select car" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Select a car</SelectItem>
                {cars.map(car => (
                  <SelectItem key={car.id} value={car.id.toString()}>
                    {car.name || car.car_load}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={errors.customer_car_id} />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="the_items">Items</Label>
          <Select 
            value={data.the_items || ''} 
            onValueChange={(value) => setData('the_items', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="رمال">رمال</SelectItem>
              <SelectItem value="تربه">تربه</SelectItem>
              <SelectItem value="زلط">زلط</SelectItem>
              <SelectItem value="رديم">رديم</SelectItem>
            </SelectContent>
          </Select>
          <InputError message={errors.the_items} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="invoice_type">Invoice Type</Label>
          <Select 
            value={data.invoice_type || 'postpaid'} 
            onValueChange={(value) => setData('invoice_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select invoice type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="postpaid">Postpaid</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>
          <InputError message={errors.invoice_type} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="unit">Unit</Label>
          <Select 
            value={data.unit || 'car'} 
            onValueChange={(value) => setData('unit', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="move">Move</SelectItem>
            </SelectContent>
          </Select>
          <InputError message={errors.unit} />
        </div>

        {/* Supply-specific fields - only shown when supply=true */}
        {data.supply && contractors && contractors.length > 0 && (
          <div className="grid gap-2">
            <Label htmlFor="contractor_id">Car Contractor</Label>
            <Select 
              value={data.contractor_id?.toString() || ''} 
              onValueChange={(value) => setData('contractor_id', value ? parseInt(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contractor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {contractors.map(contractor => (
                  <SelectItem key={contractor.id} value={contractor.id.toString()}>
                    {contractor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={errors.contractor_id} />
          </div>
        )}

        {data.supply && (
          <div className="grid gap-2">
            <Label htmlFor="custody">Custody</Label>
            <Input
              id="custody"
              type="number"
              step="0.01"
              value={data.custody || 0}
              onChange={e => setData('custody', parseFloat(e.target.value) || 0)}
              placeholder="Enter custody amount"
            />
            <InputError message={errors.custody} />
          </div>
        )}
        

        {/* Optionally included fields */}
        {cashiers && cashiers.length > 0 && (
          <div className="grid gap-2">
            <Label htmlFor="cashier_id">Cashier</Label>
            <Select 
              value={data.cashier_id?.toString() || ''} 
              onValueChange={(value) => setData('cashier_id', value ? parseInt(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cashier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Select cashier</SelectItem>
                {cashiers.map(cashier => (
                  <SelectItem key={cashier.id} value={cashier.id.toString()}>
                    {cashier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={errors.cashier_id} />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Checkbox 
            id="start_day"
            checked={data.start_day}
            onCheckedChange={(checked) => setData('start_day', !!checked)}
          />
          <Label htmlFor="start_day">Start Day</Label>
          <InputError message={errors.start_day} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={processing}>
          {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {initialValues ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}