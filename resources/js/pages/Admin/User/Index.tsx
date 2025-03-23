import React from 'react';
import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UsersTable from '@/components/User/UsersTable';
import { User } from '@/types/user';
import { Role } from '@/types/role';

interface IndexProps {
  users: {
    data: User[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      links: Array<{ url: string | null; label: string; active: boolean }>;
      path: string;
      per_page: number;
      to: number;
      total: number;
    };
  };
  filters: {
    search: string;
    role: string;
    sortField: string;
    sortDirection: string;
  };
  roles: Role[];
  userPermissions: Record<string, boolean>;
}

const Index = ({ users, filters, roles }: IndexProps) => {
  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Home', href: route('dashboard') },
      { title: 'Users', href: route('admin.users.index') },
    ]}>
      <Head title="User Management" />
      
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage users, assign roles, and set permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UsersTable users={users} filters={filters} roles={roles} />
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
};

export default Index;