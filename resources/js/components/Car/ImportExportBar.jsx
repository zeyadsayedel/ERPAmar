import { Button } from "@/Components/ui/button";
import { useDropzone } from "react-dropzone";
import { Download, Upload } from "lucide-react";
import { useCallback } from "react";

export default function ImportExportBar({ onImport, onExport, isLoading }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.[0]) {
      onImport(acceptedFiles[0]);
    }
  }, [onImport]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
      <div {...getRootProps()} className="flex-1">
        <input {...getInputProps()} />
        <Button
          variant="outline"
          className={`w-full ${isDragActive ? 'border-primary' : ''}`}
          disabled={isLoading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isDragActive ? 'Drop the file here' : 'Import CSV/Excel'}
        </Button>
      </div>

      <div className="ml-4">
        <Button
          variant="secondary"
          onClick={onExport}
          disabled={isLoading}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}