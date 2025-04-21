import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';
import { SupplyClient, SupplyClientFormData } from '@/types/supply-client';

interface SupplyClientFormProps {
  initialValues?: SupplyClient;
  onSubmit: (data: SupplyClientFormData) => void;
}

export default function SupplyClientForm({ initialValues, onSubmit }: SupplyClientFormProps) {
  const { data, setData, errors, processing } = useForm<SupplyClientFormData>({
    name: initialValues?.name || '',
    contact_person: initialValues?.contact_person || '',
    phone: initialValues?.phone || '',
    email: initialValues?.email || '',
    address: initialValues?.address || '',
    supply_type: initialValues?.supply_type || '',
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
            placeholder="Enter supply client name"
            required
          />
          <InputError message={errors.name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input
            id="contact_person"
            value={data.contact_person || ''}
            onChange={e => setData('contact_person', e.target.value)}
            placeholder="Enter contact person name"
          />
          <InputError message={errors.contact_person} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={data.phone || ''}
            onChange={e => setData('phone', e.target.value)}
            placeholder="Enter phone number"
          />
          <InputError message={errors.phone} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email || ''}
            onChange={e => setData('email', e.target.value)}
            placeholder="Enter email address"
          />
          <InputError message={errors.email} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="supply_type">Supply Type</Label>
          <Input
            id="supply_type"
            value={data.supply_type || ''}
            onChange={e => setData('supply_type', e.target.value)}
            placeholder="Enter supply type"
          />
          <InputError message={errors.supply_type} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={data.address || ''}
          onChange={e => setData('address', e.target.value)}
          placeholder="Enter address"
          rows={3}
        />
        <InputError message={errors.address} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={processing}>
          {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {initialValues ? 'Update Supply Client' : 'Create Supply Client'}
        </Button>
      </div>
    </form>
  );
}