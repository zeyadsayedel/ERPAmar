import React from 'react';
import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RoleForm from '@/components/Role/RoleForm';
import { Permission } from '@/types/role';

interface CreateProps {
  permissions: Record<string, Permission[]>;
  allPermissions: Record<string, Permission[]>;
  userPermissions: Record<string, boolean>;
}

const Create = ({ allPermissions }: CreateProps) => {
  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Home', href: route('dashboard') },
      { title: 'Roles', href: route('admin.roles.index') },
      { title: 'Create Role', href: route('admin.roles.create') },
    ]}>
      <Head title="Create Role" />
      
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Role</CardTitle>
            <CardDescription>
              Create a new role and assign permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoleForm 
              allPermissions={allPermissions} 
              action="create" 
            />
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
};

export default Create;