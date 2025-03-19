import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Role, Permission } from '@/types/role';
import { Loader2 } from 'lucide-react';

interface RoleFormProps {
  role?: Role;
  allPermissions: Record<string, Permission[]>; // Updated prop name
  rolePermissions?: number[]; // Added explicit prop for role permissions
  action: 'create' | 'update';
}

const RoleForm = ({ 
  role, 
  allPermissions, // Renamed from 'permissions'
  rolePermissions = [], // Default to empty array
  action 
}: RoleFormProps) => {
  const { data, setData, post, put, processing, errors } = useForm({
    name: role?.name || '',
    permissions: role?.permissions?.map(p => p.id) || rolePermissions || [],
  });

  console.log('All permissions:', allPermissions);
  console.log('Type of allPermissions:', typeof allPermissions);
  console.log('Keys in allPermissions:', Object.keys(allPermissions || {}));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (action === 'create') {
      post(route('admin.roles.store'));
    } else {
      put(route('admin.roles.update', role?.id));
    }
  };

  const togglePermission = (permissionId: number) => {
    const newPermissions = data.permissions.includes(permissionId)
      ? data.permissions.filter(id => id !== permissionId)
      : [...data.permissions, permissionId];
    
    setData('permissions', newPermissions);
  };

  // Handle different permission data formats
  const renderPermissions = () => {
    // If permissions is null or undefined
    if (!allPermissions) {
      return <p>No permissions available</p>;
    }
    
    // If permissions is an object with module keys
    return Object.entries(allPermissions).map(([module, modulePermissions]) => {
      // Make sure modulePermissions is an array
      const permList = Array.isArray(modulePermissions) ? modulePermissions : [];
      
      return (
        <Card key={module} className="p-4 mb-4">
          <div className="mb-2">
            <h3 className="text-lg font-medium capitalize">{module}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permList.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`permission-${permission.id}`}
                  checked={data.permissions.includes(permission.id)}
                  onCheckedChange={() => togglePermission(permission.id)}
                />
                <Label
                  htmlFor={`permission-${permission.id}`}
                  className="text-sm font-normal"
                >
                  {permission.display_name || permission.name}
                </Label>
              </div>
            ))}
          </div>
        </Card>
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Role Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={e => setData('name', e.target.value)}
          className="max-w-md"
        />
        {errors.name && (
          <Alert variant="destructive">
            <AlertDescription>{errors.name}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-4">
        <Label>Permissions</Label>
        {renderPermissions()}
        {errors.permissions && (
          <Alert variant="destructive">
            <AlertDescription>{errors.permissions}</AlertDescription>
          </Alert>
        )}
      </div>

      <Button type="submit" disabled={processing}>
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {action === 'create' ? 'Creating...' : 'Updating...'}
          </>
        ) : (
          action === 'create' ? 'Create Role' : 'Update Role'
        )}
      </Button>
    </form>
  );
};

export default RoleForm;