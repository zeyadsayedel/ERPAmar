import React from 'react';
import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserForm from '@/components/User/UserForm';
import { User } from '@/types/user';
import { Role, Permission } from '@/types/role';

interface EditProps {
  user: User;
  roles: Role[];
  modulePermissions: Record<string, Permission[]>;
  userRoles: number[];
  userDirectPermissions: number[];
  userPermissions: Record<string, boolean>;
}

const Edit = ({ 
  user, 
  roles, 
  modulePermissions,
  userRoles,
  userDirectPermissions,
}: EditProps) => {

  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Home', href: route('dashboard') },
      { title: 'Users', href: route('admin.users.index') },
      { title: `Edit ${user.name}`, href: route('admin.users.edit', user.id) },
    ]}>
      <Head title={`Edit User: ${user.name}`} />
      
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit User</CardTitle>
            <CardDescription>
              Update user details, roles, and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm
              user={user}
              roles={roles}
              modulePermissions={modulePermissions}
              userRoles={userRoles}
              userDirectPermissions={userDirectPermissions}
              action="update"
            />
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
};

export default Edit;
