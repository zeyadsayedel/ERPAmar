import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { Download, Upload } from 'lucide-react';

interface ImportExportBarProps {
  onImport: (file: File) => void;
  onExport: () => void;
  isLoading?: boolean;
}

export default function ImportExportBar({ onImport, onExport, isLoading = false }: ImportExportBarProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onImport(acceptedFiles[0]);
      }
    },
  });

  return (
    <div className="flex items-center space-x-4">
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <Button variant="outline" type="button" disabled={isLoading}>
          <Upload className="h-4 w-4 mr-2" />
          {isDragActive ? 'Drop the file here' : 'Import CSV/Excel'}
        </Button>
      </div>
      <Button variant="outline" type="button" onClick={onExport} disabled={isLoading}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  );
}