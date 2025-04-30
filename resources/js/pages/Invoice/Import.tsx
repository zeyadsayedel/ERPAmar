import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoCircledIcon, ReloadIcon } from '@radix-ui/react-icons';

interface ImportProps {
  userPermissions: {
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canImport: boolean;
    canExport: boolean;
  };
}

const Import: React.FC<ImportProps> = ({ userPermissions }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    csv: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setData('csv', file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data.csv) {
      toast.error('Please select a CSV file to import');
      return;
    }
    
    // Submit the form
    post(route('invoices.import'), {
      onSuccess: () => {
        toast.success('Invoices imported successfully');
        reset();
        setSelectedFile(null);
      },
      onError: (errors) => {
        toast.error(errors.csv || 'Failed to import invoices');
      },
      forceFormData: true,
    });
  };
  // Check if user has import permissions
  if (!userPermissions.canImport) {
    return (
      <AppLayout>
        <Head title="Import Invoices" />
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Alert variant="destructive">
              <AlertTitle>Permission Denied</AlertTitle>
              <AlertDescription>
                You don't have permission to import invoices.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head title="Import Invoices" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Import Invoices</CardTitle>
              <CardDescription>
                Upload a CSV file to import invoices from WordPress export format.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="csvFile">CSV File</Label>
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                    />
                    {errors.csv && (
                      <p className="text-sm text-red-600">{errors.csv}</p>
                    )}
                  </div>
                  
                  <Alert>
                    <InfoCircledIcon className="h-4 w-4" />
                    <AlertTitle>Import Format</AlertTitle>
                    <AlertDescription>
                      <p>The CSV file should contain WordPress export data with these tables:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li>wp_posts - Basic invoice information</li>
                        <li>wp_pods_invoice - Invoice financial details</li>
                        <li>wp_postmeta - Invoice relationships</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                  
                  {selectedFile && (
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-sm text-slate-700">
                        Selected file: <span className="font-medium">{selectedFile.name}</span> ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    reset();
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={processing || !selectedFile}
                >
                  {processing && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                  Import Invoices
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Import;
