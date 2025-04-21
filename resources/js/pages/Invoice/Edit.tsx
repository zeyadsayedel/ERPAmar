import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InvoiceForm from '@/components/Invoice/InvoiceForm';
import { Invoice, InvoiceFormData } from '@/types/invoice';
import { CustomerAccount } from '@/types/customer-account';
import { CarContractor } from '@/types/car-contractor';
import { SupplyClient } from '@/types/supply-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Props {
  invoice: Invoice;
  customerAccounts: CustomerAccount[];
  carContractors: CarContractor[];
  supplyClients: SupplyClient[];
}

export default function Edit({ invoice, customerAccounts, carContractors, supplyClients }: Props) {
  return (
    <AppLayout>
      <Head title={`Edit Invoice #${invoice.invoice_number}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Edit Invoice #{invoice.invoice_number}</CardTitle>
              <CardDescription>
                Update invoice details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceForm
                initialValues={invoice}
                customerAccounts={customerAccounts}
                carContractors={carContractors}
                supplyClients={supplyClients}
                onSubmit={(data: InvoiceFormData) => {
                  router.put(route('invoices.update', invoice.id), data);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}