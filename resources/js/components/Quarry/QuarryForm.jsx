import { useForm } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";

export default function QuarryForm({ initialValues = {}, onSubmit, isSubmitting = false }) {
  const { errors } = usePage().props;
  
  const {
    register,
    handleSubmit,
    formState: { isDirty }
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
      unit: "",
      army_account: "",
      royalty_account: "",
      loader_account: "",
      army_status: false,
      calculate_loader_hours: "",
      quarry_case: false,
      company_smoke_account_for_tractor: "",
      tractor_loaders_smoke: "",
      royalty_status: false,
      loader_hours_status: false,
      printed: "",
      ...initialValues
    }
  });

  const handleFormSubmit = (data) => {
    // Convert numeric strings to numbers and maintain boolean values
    const formattedData = Object.keys(data).reduce((acc, key) => {
      const value = data[key];
      if (typeof value === 'string' && !isNaN(value) && value !== '') {
        acc[key] = parseFloat(value);
      } else if (typeof value === 'boolean') {
        acc[key] = value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    onSubmit(formattedData);
  };

  const InputField = ({ name, label, type = "text", step, error }) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        step={step}
        {...register(name)}
        error={error}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );

  const CheckboxField = ({ name, label, error }) => (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={name}
        {...register(name)}
      />
      <Label htmlFor={name}>{label}</Label>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <InputField
            name="name"
            label="Name"
            error={errors.name}
          />
          <InputField
            name="code"
            label="Code"
            error={errors.code}
          />
          <InputField
            name="unit"
            label="Unit"
            error={errors.unit}
          />
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <InputField
            name="army_account"
            label="Army Account"
            type="number"
            step="0.01"
            error={errors.army_account}
          />
          <InputField
            name="royalty_account"
            label="Royalty Account"
            type="number"
            step="0.01"
            error={errors.royalty_account}
          />
          <InputField
            name="loader_account"
            label="Loader Account"
            type="number"
            step="0.01"
            error={errors.loader_account}
          />
          <InputField
            name="calculate_loader_hours"
            label="Calculate Loader Hours"
            type="number"
            step="0.01"
            error={errors.calculate_loader_hours}
          />
          <InputField
            name="company_smoke_account_for_tractor"
            label="Company Smoke Account (Tractor)"
            type="number"
            step="0.01"
            error={errors.company_smoke_account_for_tractor}
          />
          <InputField
            name="tractor_loaders_smoke"
            label="Tractor Loaders Smoke"
            type="number"
            step="0.01"
            error={errors.tractor_loaders_smoke}
          />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="tractor_sand_transfer_price"
              label="Tractor Sand Transfer Price"
              type="number"
              step="0.01"
              error={errors.tractor_sand_transfer_price}
            />
            <InputField
              name="trilla_sand_transfer_price"
              label="Trilla Sand Transfer Price"
              type="number"
              step="0.01"
              error={errors.trilla_sand_transfer_price}
            />
            <InputField
              name="faradani_sand_transfer_price"
              label="Faradani Sand Transfer Price"
              type="number"
              step="0.01"
              error={errors.faradani_sand_transfer_price}
            />
            <InputField
              name="farm_tractor_sand_transfer_price"
              label="Farm Tractor Sand Transfer Price"
              type="number"
              step="0.01"
              error={errors.farm_tractor_sand_transfer_price}
            />
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <CheckboxField
            name="army_status"
            label="Army Status"
            error={errors.army_status}
          />
          <CheckboxField
            name="quarry_case"
            label="Quarry Case"
            error={errors.quarry_case}
          />
          <CheckboxField
            name="royalty_status"
            label="Royalty Status"
            error={errors.royalty_status}
          />
          <CheckboxField
            name="loader_hours_status"
            label="Loader Hours Status"
            error={errors.loader_hours_status}
          />
          <InputField
            name="printed"
            label="Printed"
            type="number"
            step="1"
            error={errors.printed}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-6 border-t">
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Saving..." : "Save Quarry"}
        </Button>
      </div>
    </form>
  );
}