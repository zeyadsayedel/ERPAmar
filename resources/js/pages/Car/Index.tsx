import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TableActions } from '@/components/TableActions';
import { ImportExportBar } from '@/components/ImportExportBar';
import AppLayout from '@/layouts/app-layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';

interface Car {
  id: number;
  name: string;
  car_load: number;
  type_of_car: string;
  car_load_supply: number;
}

interface Props {
  cars: Car[];
}

export default function Index({ cars }: Props) {
  const [isImporting, setIsImporting] = useState(false);

  return (
    <AppLayout>
      <Head title="Cars" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Cars</h2>
                <div className="flex items-center gap-4">
                  <ImportExportBar
                    importRoute={route('cars.import')}
                    exportRoute={route('cars.export')}
                    onImportStart={() => setIsImporting(true)}
                    onImportComplete={() => setIsImporting(false)}
                  />
                  <Button onClick={() => window.location.href = route('cars.create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Car
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Car Load</TableHead>
                      <TableHead>Type of Car</TableHead>
                      <TableHead>Car Load Supply</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cars.map((car) => (
                      <TableRow key={car.id}>
                        <TableCell>{car.name}</TableCell>
                        <TableCell>{car.car_load}</TableCell>
                        <TableCell>{car.type_of_car}</TableCell>
                        <TableCell>{car.car_load_supply}</TableCell>
                        <TableCell>
                          <TableActions
                            editRoute={route('cars.edit', car.id)}
                            deleteRoute={route('cars.destroy', car.id)}
                            itemName="car"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {cars.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No cars found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}