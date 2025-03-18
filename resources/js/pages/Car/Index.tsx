import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TableActions from '@/components/Car/TableActions';
import ImportExportBar from '@/components/Car/ImportExportBar';
import AppLayout from '@/layouts/app-layout';
import { type Car } from '@/types/car';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  cars: Car[];
}

export default function Index({ cars }: Props) {
  const handleDelete = (id: number) => {
    router.delete(route('cars.destroy', id));
  };

  const handleImport = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    router.post(route('cars.import'), formData);
  };

  const handleExport = () => {
    window.location.href = route('cars.export');
  };

  return (
    <AppLayout>
      <Head title="Cars" />

      <div className="p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-semibold">Cars</CardTitle>
            <Button onClick={() => router.visit(route('cars.create'))}>
              <Plus className="h-4 w-4 mr-2" />
              Add Car
            </Button>
          </CardHeader>
          <CardContent>
            <ImportExportBar
              onImport={handleImport}
              onExport={handleExport}
              isLoading={false}
            />

            <div className="mt-6 relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Load</TableHead>
                    <TableHead>Load Supply</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>{car.name}</TableCell>
                      <TableCell>{car.type_of_car}</TableCell>
                      <TableCell>{car.car_load}</TableCell>
                      <TableCell>{car.car_load_supply}</TableCell>
                      <TableCell>
                        <TableActions
                          onEdit={() => router.visit(route('cars.edit', car.id))}
                          onDelete={() => handleDelete(car.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}