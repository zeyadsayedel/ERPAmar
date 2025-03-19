import React from 'react';
import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RoleForm from '@/components/Role/RoleForm';
import { Role, Permission } from '@/types/role';

interface EditRoleProps {
  role: Role;
  allPermissions: Record<string, Permission[]>;
  rolePermissions: number[];
  userPermissions: Record<string, boolean>;
}

const Edit = ({ role, allPermissions, rolePermissions }: EditRoleProps) => {
  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Home', href: route('dashboard') },
      { title: 'Roles', href: route('admin.roles.index') },
      { title: `Edit ${role.name}`, href: route('admin.roles.edit', role.id) },
    ]}>
      <Head title={`Edit Role: ${role.name}`} />
      
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Role</CardTitle>
            <CardDescription>
              Update role details and manage its permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoleForm 
                role={role} 
                allPermissions={allPermissions} 
                rolePermissions={rolePermissions}
                action="update" 
              />
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
};

export default Edit;