import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterModuleForm } from '@/components/Permission';
import { PermissionCreateForm } from '@/components/Permission/PermissionCreateForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { RegisterModuleData } from '@/types/role';

interface CreateProps {
  moduleParam?: string;
}

export default function Create({ moduleParam }: CreateProps) {
  const { processing } = useForm();
  const [activeTab, setActiveTab] = useState<string>(moduleParam ? 'single' : 'module');

  const handleSubmitModule = (formData: RegisterModuleData) => {
    router.post(route('admin.permissions.store'), {
      ...formData,
      preserveScroll: true,
    });
  };

  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Home', href: route('dashboard') },
      { title: 'Permissions', href: route('admin.permissions.index') },
      { title: 'Create Permissions', href: route('admin.permissions.create') },
    ]}>
      <Head title="Create Permissions" />
      
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Permissions</CardTitle>
            <CardDescription>
              Create permissions individually or register a set of standardized permissions for a module
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="module">Register Module</TabsTrigger>
                <TabsTrigger value="single">Create Single Permission</TabsTrigger>
              </TabsList>
              
              <TabsContent value="module">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Register Module Permissions</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a complete set of permissions for a new module
                    </p>
                  </div>
                  <RegisterModuleForm onSubmit={handleSubmitModule} isSubmitting={processing} />
                </div>
              </TabsContent>
              
              <TabsContent value="single">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Create Individual Permission</h3>
                    <p className="text-sm text-muted-foreground">
                      Add a single permission with a specific name
                    </p>
                  </div>
                  <PermissionCreateForm module={moduleParam} isSubmitting={processing} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}