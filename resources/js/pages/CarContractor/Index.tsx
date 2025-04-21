import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TableActions from '@/components/CarContractor/TableActions';
import { CarContractor } from '@/types/car-contractor';
import { PermissionChecker } from '@/components/Permission';

interface Props {
  contractors: CarContractor[];
  userPermissions?: Record<string, boolean>;
}

export default function Index({ contractors = [] }: Props) {
  // Ensure contractors is an array even if it comes in as another type
  const contractorsArray = Array.isArray(contractors) ? contractors : [];
  
  const handleDelete = (id: number) => {
    router.delete(route('car-contractors.destroy', id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AppLayout>
      <Head title="Car Contractors" />

      <div className="p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-semibold">Car Contractors</CardTitle>
            <PermissionChecker permission="car_contractor:create">
              <Button onClick={() => router.visit(route('car-contractors.create'))}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contractor
              </Button>
            </PermissionChecker>
          </CardHeader>
          <CardContent>
            <div className="mt-6 relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow> 
                </TableHeader>
                <TableBody>
                  {contractorsArray.map((contractor) => (
                    <TableRow key={contractor.id}>
                      <TableCell>{contractor.name}</TableCell>
                      <TableCell>{formatDate(contractor.created_at)}</TableCell>
                      <TableCell>
                        <TableActions
                          viewRoute={route('car-contractors.show', contractor.id)}
                          editRoute={route('car-contractors.edit', contractor.id)}
                          onDelete={() => handleDelete(contractor.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {contractorsArray.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        No car contractors found.
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