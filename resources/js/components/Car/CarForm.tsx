import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';

interface CarFormData {
  name: string;
  car_load: string;
  type_of_car: string;
  car_load_supply: string;
}

interface CarFormProps {
  initialValues?: CarFormData;
  onSubmit: (data: CarFormData) => void;
}

export default function CarForm({ initialValues, onSubmit }: CarFormProps) {
  const { data, setData, errors, processing, reset } = useForm<CarFormData>({
    name: initialValues?.name || '',
    car_load: initialValues?.car_load?.toString() || '',
    type_of_car: initialValues?.type_of_car || '',
    car_load_supply: initialValues?.car_load_supply?.toString() || '',
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={data.name}
          onChange={e => setData('name', e.target.value)}
          placeholder="Enter car name"
        />
        <InputError message={errors.name} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="car_load">Car Load</Label>
        <Input
          id="car_load"
          type="number"
          step="0.01"
          value={data.car_load}
          onChange={e => setData('car_load', e.target.value)}
          placeholder="Enter car load"
        />
        <InputError message={errors.car_load} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="type_of_car">Type of Car</Label>
        <Input
          id="type_of_car"
          type="text"
          value={data.type_of_car}
          onChange={e => setData('type_of_car', e.target.value)}
          placeholder="Enter car type"
        />
        <InputError message={errors.type_of_car} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="car_load_supply">Car Load Supply</Label>
        <Input
          id="car_load_supply"
          type="number"
          step="0.01"
          value={data.car_load_supply}
          onChange={e => setData('car_load_supply', e.target.value)}
          placeholder="Enter car load supply"
        />
        <InputError message={errors.car_load_supply} />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={processing}>
          {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {initialValues ? 'Update Car' : 'Create Car'}
        </Button>
      </div>
    </form>
  );
}