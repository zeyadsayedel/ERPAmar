import React from 'react';
import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserForm from '@/components/User/UserForm';
import { Role } from '@/types/role';
import { PermissionChecker } from '@/components/Permission';

interface CreateProps {
  roles: Role[];
  modulePermissions: Record<string, []>;
  userPermissions?: Record<string, boolean>;
}


// how to use permission checker in the component
// import PermissionChecker from '@/components/Permission/PermissionChecker';
// <PermissionChecker permission="create" fallback={<div>You do not have permission to create a user</div>}>

const Create = ({ roles, modulePermissions, userPermissions }: CreateProps) => {
  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Home', href: route('dashboard') },
      { title: 'Users', href: route('admin.users.index') },
      { title: 'Create User', href: route('admin.users.create') },
    ]}>
      <Head title="Create User" />

      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
            <CardDescription>
              Add a new user to the system and assign roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PermissionChecker permission={userPermissions?.create ? 'create' : ''} fallback={<div>You do not have permission to create a user</div>}>
              <UserForm
                roles={roles}
                modulePermissions={modulePermissions}
                action="create"
              />
            </PermissionChecker>

          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
};

export default Create;
