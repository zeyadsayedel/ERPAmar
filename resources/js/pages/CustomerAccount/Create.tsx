import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CustomerAccountForm from '@/components/CustomerAccount/CustomerAccountForm';
import { CustomerAccountFormData } from '@/types/customer-account';
import { Quarry } from '@/types/quarry';
import { CarContractor } from '@/types/car-contractor';

interface Props {
  quarries: Quarry[];
  contractors: CarContractor[];
  userPermissions: Record<string, boolean>;
}

export default function Create({ quarries, contractors }: Props) {
  return (
    <AppLayout>
      <Head title="Create Customer Account" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Customer Account</CardTitle>
              <CardDescription>
                Add a new customer to your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerAccountForm
                quarries={quarries}
                contractors={contractors}
                onSubmit={(data: CustomerAccountFormData) => {
                  router.post(route('customer-accounts.store'), data);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}