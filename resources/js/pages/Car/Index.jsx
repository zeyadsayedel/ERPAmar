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
import TableActions from "@/Components/Car/TableActions";
import ImportExportBar from "@/Components/Car/ImportExportBar";
import AppLayout from "@/Layouts/AppLayout";

export default function Index({ cars }) {
  const handleDelete = (id) => {
    router.delete(route("cars.destroy", id));
  };

  const handleImport = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    router.post(route("cars.import"), formData);
  };

  const handleExport = () => {
    window.location.href = route("cars.export");
  };

  return (
    <AppLayout>
      <Head title="Cars" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Cars</h2>
                <Button onClick={() => router.visit(route("cars.create"))}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Car
                </Button>
              </div>

              <ImportExportBar
                onImport={handleImport}
                onExport={handleExport}
              />

              <div className="mt-6">
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
                            onEdit={() => router.visit(route("cars.edit", car.id))}
                            onDelete={() => handleDelete(car.id)}
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