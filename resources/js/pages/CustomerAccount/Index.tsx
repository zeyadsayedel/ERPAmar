import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TableActions from '@/components/CustomerAccount/TableActions';
import { CustomerAccount } from '@/types/customer-account';
import { PermissionChecker } from '@/components/Permission';

interface Props {
  customers: CustomerAccount[];
  permissions: Record<string, boolean>;
}

export default function Index({ customers }: Props) {
  const handleDelete = (id: number) => {
    router.delete(route('customer-accounts.destroy', id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <AppLayout>
      <Head title="Customer Accounts" />

      <div className="p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-semibold">Customer Accounts</CardTitle>
            <PermissionChecker permission="customer_account:create">
              <Button onClick={() => router.visit(route('customer-accounts.create'))}>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </PermissionChecker>
          </CardHeader>
          <CardContent>
            <div className="mt-6 relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.name}</TableCell>
                      
                      <TableCell>
                        <TableActions
                          onView={() => router.visit(route('customer-accounts.show', customer.id))}
                          onEdit={() => router.visit(route('customer-accounts.edit', customer.id))}
                          onDelete={() => handleDelete(customer.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {customers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No customers found.
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