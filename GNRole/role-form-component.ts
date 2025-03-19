import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RoleFormData, Permission } from '@/types/role';

interface RoleFormProps {
  initialValues?: {
    id?: number;
    name: string;
    permissions: number[];
  };
  permissionsByModule: Record<string, Permission[]>;
  onSubmit: (data: RoleFormData) => void;
  isSubmitting?: boolean;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  initialValues = { name: '', permissions: [] },
  permissionsByModule,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: initialValues.name,
    permissions: initialValues.permissions || [],
  });
  
  const [activeTab, setActiveTab] = useState<string>(
    Object.keys(permissionsByModule).length > 0
      ? Object.keys(permissionsByModule)[0]
      : 'general'
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionToggle = (permissionId: number) => {
    setFormData((prev) => {
      const permissions = [...prev.permissions];
      
      if (permissions.includes(permissionId)) {
        return {
          ...prev,
          permissions: permissions.filter((id) => id !== permissionId),
        };
      } else {
        return {
          ...prev,
          permissions: [...permissions, permissionId],
        };
      }
    });
  };

  const handleModuleSelectAll = (module: string) => {
    const modulePermissionIds = permissionsByModule[module].map((p) => p.id);
    const allSelected = modulePermissionIds.every((id) => formData.permissions.includes(id));
    
    setFormData((prev) => {
      if (allSelected) {
        // Deselect all permissions from this module
        return {
          ...prev,
          permissions: prev.permissions.filter((id) => !modulePermissionIds.includes(id)),
        };
      } else {
        // Select all permissions from this module
        const currentSelected = new Set(prev.permissions);
        modulePermissionIds.forEach((id) => currentSelected.add(id));
        return {
          ...prev,
          permissions: Array.from(currentSelected),
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Role Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter role name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Permissions</Label>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {Object.keys(permissionsByModule).map((module) => (
                <TabsTrigger key={module} value={module} className="capitalize">
                  {module}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(permissionsByModule).map(([module, permissions]) => (
              <TabsContent key={module} value={module}>
                <Card>
                  <CardContent className="p-4">
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="text-lg font-medium capitalize">{module} Permissions</h3>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleModuleSelectAll(module)}
                      >
                        {permissions.every((p) => formData.permissions.includes(p.id))
                          ? 'Deselect All'
                          : 'Select All'}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                          />
                          <Label
                            htmlFor={`permission-${permission.id}`}
                            className="cursor-pointer"
                          >
                            {permission.display_name || permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialValues.id ? 'Update Role' : 'Create Role'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RoleForm;
