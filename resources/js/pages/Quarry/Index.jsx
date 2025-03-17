import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";
import TableActions from "@/Components/Quarry/TableActions";
import ImportExportBar from "@/Components/Car/ImportExportBar";
import AppLayout from "@/Layouts/AppLayout";

export default function Index({ quarries }) {
  const handleDelete = (id) => {
    router.delete(route("quarries.destroy", id));
  };

  const handleImport = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    router.post(route("quarries.import"), formData);
  };

  const handleExport = () => {
    window.location.href = route("quarries.export");
  };

  return (
    <AppLayout>
      <Head title="Quarries" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Quarries</h2>
                <Button onClick={() => router.visit(route("quarries.create"))}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Quarry
                </Button>
              </div>

              <ImportExportBar
                onImport={handleImport}
                onExport={handleExport}
              />

              <div className="mt-6 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Army Account</TableHead>
                      <TableHead>Royalty Account</TableHead>
                      <TableHead>Loader Account</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quarries.map((quarry) => (
                      <TableRow key={quarry.id}>
                        <TableCell>{quarry.name}</TableCell>
                        <TableCell>{quarry.code}</TableCell>
                        <TableCell>{quarry.unit}</TableCell>
                        <TableCell>{quarry.army_account}</TableCell>
                        <TableCell>{quarry.royalty_account}</TableCell>
                        <TableCell>{quarry.loader_account}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col gap-1 text-xs">
                            {quarry.army_status && <span className="text-green-600">Army</span>}
                            {quarry.royalty_status && <span className="text-blue-600">Royalty</span>}
                            {quarry.loader_hours_status && <span className="text-purple-600">Loader</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <TableActions
                            onEdit={() => router.visit(route("quarries.edit", quarry.id))}
                            onDelete={() => handleDelete(quarry.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
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