import { useForm } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { usePage } from "@inertiajs/react";

export default function CarForm({ initialValues = {}, onSubmit, isSubmitting = false }) {
  const { errors } = usePage().props;
  
  const {
    register,
    handleSubmit,
    formState: { isDirty }
  } = useForm({
    defaultValues: {
      name: "",
      car_load: "",
      type_of_car: "",
      car_load_supply: "",
      ...initialValues
    }
  });

  const handleFormSubmit = (data) => {
    // Convert numeric strings to numbers
    const formattedData = {
      ...data,
      car_load: data.car_load ? parseFloat(data.car_load) : null,
      car_load_supply: data.car_load_supply ? parseFloat(data.car_load_supply) : null
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name")}
          error={errors.name}
          placeholder="Enter car name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="car_load">Car Load</Label>
        <Input
          id="car_load"
          type="number"
          step="0.01"
          {...register("car_load")}
          error={errors.car_load}
          placeholder="Enter car load"
        />
        {errors.car_load && (
          <p className="text-sm text-red-500">{errors.car_load}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type_of_car">Type of Car</Label>
        <Textarea
          id="type_of_car"
          {...register("type_of_car")}
          error={errors.type_of_car}
          placeholder="Enter car type"
        />
        {errors.type_of_car && (
          <p className="text-sm text-red-500">{errors.type_of_car}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="car_load_supply">Car Load Supply</Label>
        <Input
          id="car_load_supply"
          type="number"
          step="0.01"
          {...register("car_load_supply")}
          error={errors.car_load_supply}
          placeholder="Enter car load supply"
        />
        {errors.car_load_supply && (
          <p className="text-sm text-red-500">{errors.car_load_supply}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Saving..." : "Save Car"}
        </Button>
      </div>
    </form>
  );
}