import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ImportExportBarProps {
  importRoute: string;
  exportRoute: string;
  onImportStart?: () => void;
  onImportComplete?: () => void;
}

export function ImportExportBar({
  importRoute,
  exportRoute,
  onImportStart,
  onImportComplete,
}: ImportExportBarProps) {
  const [dragActive, setDragActive] = useState(false);
  const { setData, post, progress } = useForm({
    file: null as File | null,
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setData('file', file);
    onImportStart?.();
    post(importRoute, {
      onSuccess: () => {
        onImportComplete?.();
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative ${dragActive ? 'bg-muted/50' : ''}`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleChange}
          accept=".csv,.xlsx"
        />
        <Label
          htmlFor="file-upload"
          className="cursor-pointer"
        >
          <Button
            type="button"
            variant="outline"
            className={progress ? 'opacity-50 cursor-not-allowed' : ''}
            disabled={!!progress}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </Label>
      </div>

      <Button
        variant="outline"
        onClick={() => window.location.href = exportRoute}
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  );
}