import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CustomerAccountForm from '@/components/CustomerAccount/CustomerAccountForm';
import { CustomerAccount, CustomerAccountFormData } from '@/types/customer-account';
import { Quarry } from '@/types/quarry';
import { CarContractor } from '@/types/car-contractor';

interface Props {
  customerAccount: CustomerAccount;
  quarries: Quarry[];
  contractors: CarContractor[];
  userPermissions: Record<string, boolean>;
}

export default function Edit({ customerAccount, quarries, contractors }: Props) {
  return (
    <AppLayout>
      <Head title={`Edit ${customerAccount.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Edit Customer Account</CardTitle>
              <CardDescription>
                Update information for {customerAccount.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerAccountForm
                initialValues={customerAccount}
                quarries={quarries}
                contractors={contractors}
                onSubmit={(data: CustomerAccountFormData) => {
                  router.put(route('customer-accounts.update', customerAccount.id), data);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}