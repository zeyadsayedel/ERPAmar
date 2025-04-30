import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TableActions from '@/components/Invoice/TableActions';
import { Invoice } from '@/types/invoice';
import { PermissionChecker } from '@/components/Permission';

interface Props {
  invoices: Invoice[];
  permissions?: Record<string, boolean>;
}

export default function Index({ invoices }: Props) {
  const handleDelete = (id: number) => {
    router.delete(route('invoices.destroy', id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadgeClass = (flag: number) => {
    switch (flag) {
      case 1:
        return 'bg-green-100 text-green-800';
      case 0:
        return 'bg-red-100 text-red-800';
      case 2:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <AppLayout>
      <Head title="Invoices" />

      <div className="p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-semibold">Invoices</CardTitle>
            <PermissionChecker permission="invoice:create">
              <Button onClick={() => router.visit(route('invoice.create'))}>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </PermissionChecker>
          </CardHeader>
          <CardContent>
            <div className="mt-6 relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoice_number}</TableCell>
                      <TableCell>{formatDate(invoice.created_at)}</TableCell>
                      <TableCell>{invoice.customer?.name}</TableCell>
                      <TableCell>{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>
                        {/* reminder change status to flag and make flag like this 0= cancelled 1= paid 2=returned */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(invoice.flag)}`}>
                          {invoice.flag === 0 ? 'Cancelled' : invoice.flag === 1 ? 'Paid' : 'Returned'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <TableActions
                          onView={() => router.visit(route('invoices.show', invoice.id))}
                          onEdit={() => router.visit(route('invoices.edit', invoice.id))}
                          onDelete={() => handleDelete(invoice.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {invoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No invoices found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}