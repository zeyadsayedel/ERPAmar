import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TableActions from '@/components/SupplyClient/TableActions';
import { SupplyClient } from '@/types/supply-client';
import { PermissionChecker } from '@/components/Permission';

interface Props {
  supplyClients: SupplyClient[];
  permissions: Record<string, boolean>;
}

export default function Index({ supplyClients, permissions }: Props) {
  const handleDelete = (id: number) => {
    router.delete(route('supply-clients.destroy', id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AppLayout>
      <Head title="Supply Clients" />

      <div className="p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-semibold">Supply Clients</CardTitle>
            <PermissionChecker permission="supply_client:create">
              <Button onClick={() => router.visit(route('supply-clients.create'))}>
                <Plus className="h-4 w-4 mr-2" />
                Add Supply Client
              </Button>
            </PermissionChecker>
          </CardHeader>
          <CardContent>
            <div className="mt-6 relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Supply Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplyClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.contact_person || '-'}</TableCell>
                      <TableCell>{client.phone || '-'}</TableCell>
                      <TableCell>{client.supply_type || '-'}</TableCell>
                      <TableCell>{formatDate(client.created_at)}</TableCell>
                      <TableCell>
                        <TableActions
                          onView={() => router.visit(route('supply-clients.show', client.id))}
                          onEdit={() => router.visit(route('supply-clients.edit', client.id))}
                          onDelete={() => handleDelete(client.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {supplyClients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No supply clients found.
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