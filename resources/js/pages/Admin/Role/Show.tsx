import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Role, Permission } from '@/types/role';

interface ShowProps {
  role: Role;
}

const Show = ({ role }: ShowProps) => {
  // Group permissions by module
  const permissionsByModule: Record<string, Permission[]> = {};
  
  role.permissions.forEach((permission) => {
    const module = permission.module || 'general';
    if (!permissionsByModule[module]) {
      permissionsByModule[module] = [];
    }
    permissionsByModule[module].push(permission);
  });

  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Home', href: route('dashboard') },
      { title: 'Roles', href: route('admin.roles.index') },
      { title: role.name, href: route('admin.roles.show', role.id) },
    ]}>
      <Head title={`Role: ${role.name}`} />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={route('admin.roles.index')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Roles
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Role: {role.name}</h1>
          </div>
          
          <Button asChild>
            <Link href={route('admin.roles.edit', role.id)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Role
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Details</CardTitle>
              <CardDescription>
                Information about the role and its assigned permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                  <dd className="text-lg">{role.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Guard</dt>
                  <dd className="text-lg">{role.guard_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                  <dd className="text-lg">{new Date(role.created_at).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                  <dd className="text-lg">{new Date(role.updated_at).toLocaleDateString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Permissions ({role.permissions.length})</CardTitle>
              <CardDescription>
                Permissions assigned to this role grouped by module.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(permissionsByModule).length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No permissions assigned to this role.
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(permissionsByModule).map(([module, permissions]) => (
                    <div key={module}>
                      <h3 className="text-lg font-medium capitalize mb-2">{module}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center gap-2 p-2 border rounded-md">
                            {permission.action && (
                              <Badge variant="outline" className="capitalize">
                                {permission.action}
                              </Badge>
                            )}
                            <span className="text-sm">
                              {permission.display_name || permission.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      {module !== Object.keys(permissionsByModule).pop() && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppSidebarLayout>
  );
};

export default Show;
