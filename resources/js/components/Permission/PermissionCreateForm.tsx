import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';

interface PermissionCreateFormProps {
  module?: string;
  isSubmitting?: boolean;
}

export function PermissionCreateForm({ module = '', isSubmitting = false }: PermissionCreateFormProps) {
  const [name, setName] = useState<string>(module ? `${module}:` : '');
  
  // Update name if module prop changes
  useEffect(() => {
    if (module) {
      setName(`${module}:`);
    }
  }, [module]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    router.post(route('admin.permissions.store'), {
      name: name.trim(),
    }, {
      preserveScroll: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Permission Name</Label>
        <Input
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g., module:action"
          required
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">
          Use the format "module:action" like "user:create" or "post:delete"
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !name.trim() || !name.includes(':')}>
          {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Creating...' : 'Create Permission'}
        </Button>
      </div>
    </form>
  );
}

export default PermissionCreateForm;