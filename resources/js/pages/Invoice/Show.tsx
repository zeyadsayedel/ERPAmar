import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { PermissionChecker } from '@/components/Permission';

interface Props {
  invoice: Invoice;
  permissions?: Record<string, boolean>;
}

export default function Show({ invoice }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <AppLayout>
      <Head title={`Invoice #${invoice.invoice_number}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <Button variant="outline" onClick={() => router.visit(route('invoices.index'))} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invoices
            </Button>
            <PermissionChecker permission="invoice:update">
              <Button variant="outline" onClick={() => router.visit(route('invoices.edit', invoice.id))}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Invoice
              </Button>
            </PermissionChecker>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Invoice #{invoice.invoice_number}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(invoice.status)}`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                  <p className="mt-1 text-sm text-gray-900">{invoice.customer_account?.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(invoice.date)}</p>
                </div>

                {invoice.car_contractor && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Car Contractor</h3>
                    <p className="mt-1 text-sm text-gray-900">{invoice.car_contractor.name}</p>
                  </div>
                )}

                {invoice.supply_client && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Supply Client</h3>
                    <p className="mt-1 text-sm text-gray-900">{invoice.supply_client.name}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                  <p className="mt-1 text-sm text-gray-900 font-bold">{formatCurrency(invoice.total_amount)}</p>
                </div>
              </div>

              {invoice.notes && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{invoice.notes}</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t bg-gray-50 text-xs text-gray-500 flex justify-between">
              <span>Created: {formatDate(invoice.created_at)}</span>
              <span>Last Updated: {formatDate(invoice.updated_at)}</span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}