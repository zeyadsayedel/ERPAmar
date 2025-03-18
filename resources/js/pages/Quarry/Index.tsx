import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TableActions } from '@/components/TableActions';
import { ImportExportBar } from '@/components/ImportExportBar';
import { Badge } from '@/components/ui/badge';
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

interface Quarry {
  id: number;
  name: string;
  army_account: number;
  royalty_account: number;
  loader_account: number;
  army_status: boolean;
  calculate_loader_hours: number;
  quarry_case: boolean;
  royalty_status: boolean;
  loader_hours_status: boolean;
  printed: number;
  unit: string;
  code: string;
}

interface Props {
  quarries: Quarry[];
}

export default function Index({ quarries }: Props) {
  const [isImporting, setIsImporting] = useState(false);

  const renderStatus = (status: boolean) => (
    <Badge variant={status ? 'success' : 'secondary'}>
      {status ? 'Active' : 'Inactive'}
    </Badge>
  );

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <AppLayout>
      <Head title="Quarries" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-background overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Quarries</h2>
                <div className="flex items-center gap-4">
                  <ImportExportBar
                    importRoute={route('quarries.import')}
                    exportRoute={route('quarries.export')}
                    onImportStart={() => setIsImporting(true)}
                    onImportComplete={() => setIsImporting(false)}
                  />
                  <Button onClick={() => window.location.href = route('quarries.create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Quarry
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Army Account</TableHead>
                      <TableHead>Royalty Account</TableHead>
                      <TableHead>Loader Account</TableHead>
                      <TableHead>Army Status</TableHead>
                      <TableHead>Royalty Status</TableHead>
                      <TableHead>Loader Hours Status</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quarries.map((quarry) => (
                      <TableRow key={quarry.id}>
                        <TableCell>{quarry.name}</TableCell>
                        <TableCell>{quarry.code}</TableCell>
                        <TableCell>{quarry.unit}</TableCell>
                        <TableCell>{formatNumber(quarry.army_account)}</TableCell>
                        <TableCell>{formatNumber(quarry.royalty_account)}</TableCell>
                        <TableCell>{formatNumber(quarry.loader_account)}</TableCell>
                        <TableCell>{renderStatus(quarry.army_status)}</TableCell>
                        <TableCell>{renderStatus(quarry.royalty_status)}</TableCell>
                        <TableCell>{renderStatus(quarry.loader_hours_status)}</TableCell>
                        <TableCell>
                          <TableActions
                            editRoute={route('quarries.edit', quarry.id)}
                            deleteRoute={route('quarries.destroy', quarry.id)}
                            itemName="quarry"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {quarries.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-4 text-muted-foreground">
                          No quarries found.
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