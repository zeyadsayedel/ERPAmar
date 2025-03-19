import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Pencil, 
  Trash, 
  Plus, 
  ArrowLeft, 
  LoaderCircle 
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link, router } from '@inertiajs/react';
import type { Permission } from '@/types/role';

interface ModulePermissionsProps {
  module: string;
  permissions: Permission[];
  availableActions: string[];
  userPermissions?: Record<string, boolean>;
}

export default function ModulePermissions({ 
  module, 
  permissions = [], 
  availableActions = [],
  userPermissions = {}
}: ModulePermissionsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const { data, setData, post, processing, reset, errors } = useForm({
    action: '',
  });
  
  // Check permissions
  const canCreate = userPermissions?.create ?? false;
  const canUpdate = userPermissions?.update ?? false;
  const canDelete = userPermissions?.delete ?? false;
  
  // Ensure permissions is an array
  const permissionsList = Array.isArray(permissions) ? permissions : [];
  
  // Get existing action names
  const existingActions = permissionsList.map(permission => {
    const parts = permission.name.split(':');
    return parts.length > 1 ? parts[1] : '';
  });
  
  // Get suggested actions that don't already exist
  const suggestedActions = availableActions.filter(
    action => !existingActions.includes(action)
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route('admin.permissions.module.add', module), {
      onSuccess: () => {
        reset();
        setShowAddForm(false);
      },
    });
  };
  
  const handleDelete = (permission: Permission) => {
    router.delete(route('admin.permissions.destroy', permission.id), {
      preserveScroll: true,
    });
  };

  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Home', href: route('dashboard') },
      { title: 'Permissions', href: route('admin.permissions.index') },
      { title: `${module} Module`, href: route('admin.permissions.module', module) },
    ]}>
      <Head title={`${module} Module Permissions`} />
      
      <div className="container py-6">
        <div className="mb-6 flex justify-between items-center">
          <Button asChild variant="outline">
            <Link href={route('admin.permissions.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Permissions
            </Link>
          </Button>
          
          {canCreate && (
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Permission
            </Button>
          )}
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{module} Module Permissions</CardTitle>
            <CardDescription>
              Manage permissions for the {module} module
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showAddForm && canCreate && (
              <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-md">
                <h3 className="text-lg font-medium mb-4">Add New Permission</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="action">Action Name</Label>
                    <Input
                      id="action"
                      value={data.action}
                      onChange={e => setData('action', e.target.value)}
                      placeholder="e.g., export, archive, approve"
                      required
                    />
                    {errors.action && (
                      <p className="text-sm text-red-500">{errors.action}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Will create permission: {module}:{data.action || '[action]'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Suggested Actions</Label>
                    <div className="flex flex-wrap gap-2">
                      {suggestedActions.map(action => (
                        <Badge 
                          key={action}
                          variant="outline" 
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => setData('action', action)}
                        >
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={processing || !data.action.trim()}
                  >
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Add Permission
                  </Button>
                </div>
              </form>
            )}
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Created At</TableHead>
                    {(canUpdate || canDelete) && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionsList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canUpdate || canDelete ? 4 : 3} className="h-24 text-center">
                        No permissions found for this module
                      </TableCell>
                    </TableRow>
                  ) : (
                    permissionsList.map((permission) => {
                      const parts = permission.name.split(':');
                      const action = parts.length > 1 ? parts[1] : permission.name;
                      
                      return (
                        <TableRow key={permission.id}>
                          <TableCell className="font-medium">{permission.name}</TableCell>
                          <TableCell>
                            <Badge>{action}</Badge>
                          </TableCell>
                          <TableCell>{new Date(permission.created_at).toLocaleDateString()}</TableCell>
                          {(canUpdate || canDelete) && (
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                {canUpdate && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                  >
                                    <Link href={route('admin.permissions.edit', permission.id)}>
                                      <Pencil className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                )}
                                
                                {canDelete && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Permission</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{permission.name}"?
                                          This action cannot be undone and may affect users with this permission.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDelete(permission)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}