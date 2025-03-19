import React from 'react';
import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RolesTable from '@/components/Role/RolesTable';
import { Role } from '@/types/role';

interface IndexProps {
  roles: Role[];
}

const Index = ({ roles }: IndexProps) => {
  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Home', href: route('dashboard') },
      { title: 'Roles', href: route('admin.roles.index') },
    ]}>
      <Head title="Roles" />
      
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>
              Manage roles and their permissions in your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RolesTable roles={roles} />
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
};

export default Index;