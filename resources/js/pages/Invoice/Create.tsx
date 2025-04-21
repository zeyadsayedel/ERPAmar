import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InvoiceForm from '@/components/Invoice/InvoiceForm';
import { InvoiceFormData } from '@/types/invoice';
import { CustomerAccount } from '@/types/customer-account';
import { CarContractor } from '@/types/car-contractor';
import { SupplyClient } from '@/types/supply-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Props {
  customerAccounts: CustomerAccount[];
  carContractors: CarContractor[];
  supplyClients: SupplyClient[];
}

export default function Create({ customerAccounts, carContractors, supplyClients }: Props) {
  return (
    <AppLayout>
      <Head title="Create Invoice" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Create New Invoice</CardTitle>
              <CardDescription>
                Create a new invoice for your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceForm
                customerAccounts={customerAccounts}
                carContractors={carContractors}
                supplyClients={supplyClients}
                onSubmit={(data: InvoiceFormData) => {
                  router.post(route('invoices.store'), data);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}