import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PermissionEditForm } from '@/components/Permission/PermissionEditForm';
import type { Permission } from '@/types/role';

interface EditProps {
  permission: Permission;
}

export default function Edit({ permission }: EditProps) {
  const { processing } = useForm();

  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Home', href: route('dashboard') },
      { title: 'Permissions', href: route('admin.permissions.index') },
      { title: 'Edit Permission', href: route('admin.permissions.edit', permission.id) },
    ]}>
      <Head title="Edit Permission" />
      
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Permission</CardTitle>
            <CardDescription>
              Update the permission name to follow the module:action format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PermissionEditForm permission={permission} isSubmitting={processing} />
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}