import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';
import type { Permission } from '@/types/role';

interface PermissionEditFormProps {
  permission: Permission;
  isSubmitting?: boolean;
}

export function PermissionEditForm({ permission, isSubmitting = false }: PermissionEditFormProps) {
  const [name, setName] = useState<string>(permission.name);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    router.put(route('admin.permissions.update', permission.id), {
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
        <Button type="submit" disabled={isSubmitting || !name.trim() || name === permission.name}>
          {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : 'Update Permission'}
        </Button>
      </div>
    </form>
  );
}

export default PermissionEditForm;