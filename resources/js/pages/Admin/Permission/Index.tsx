import React from 'react';
import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PermissionsTable } from '@/components/Permission';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';
import type { Permission } from '@/types/role';

interface IndexProps {
  permissionsByModule: Record<string, Permission[]>;
  userPermissions?: Record<string, boolean>;
}

const Index = ({ permissionsByModule, userPermissions }: IndexProps) => {
  // Check if we have create permission
  const canCreate = userPermissions?.create ?? false;
  
  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Home', href: route('dashboard') },
      { title: 'Permissions', href: route('admin.permissions.index') },
    ]}>
      <Head title="Permissions Management" />
      
      <div className="container py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Permissions Management</CardTitle>
              <CardDescription>
                View and manage module-based permissions in your application
              </CardDescription>
            </div>
            {canCreate && (
              <Button asChild>
                <Link href={route('admin.permissions.create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Register Module
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <PermissionsTable 
              permissions={permissionsByModule} 
              readOnly={!canCreate}
            />
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}

export default Index;