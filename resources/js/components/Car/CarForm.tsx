import { useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { type Car, type CarFormData } from '@/types/car';

interface CarFormProps {
  initialValues?: Car;
  onSubmit: (data: CarFormData) => void;
  isSubmitting?: boolean;
}

export default function CarForm({ initialValues, onSubmit, isSubmitting = false }: CarFormProps) {
  const { data, setData, errors, processing } = useForm<CarFormData>({
    name: initialValues?.name ?? '',
    car_load: initialValues?.car_load?.toString() ?? '',
    type_of_car: initialValues?.type_of_car ?? '',
    car_load_supply: initialValues?.car_load_supply?.toString() ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Car Name</Label>
        <Input
          id="name"
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
        <Button type="submit" disabled={processing || isSubmitting}>
          {(processing || isSubmitting) && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {initialValues ? 'Update Car' : 'Create Car'}
        </Button>
      </div>
    </form>
  );
}