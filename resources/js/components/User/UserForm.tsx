import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Role, Permission } from '@/types/role';
import { Loader2 } from 'lucide-react';

interface User {
  id?: number;
  name: string;
  email: string;
  first_name?: string;
  last_name?: string;
  nickname?: string;
  roles?: Role[];
  permissions?: Permission[];
}

interface UserFormProps {
  user?: User;
  roles: Role[];
  modulePermissions?: Record<string, Permission[]>;
  userRoles?: number[];
  userDirectPermissions?: number[];
  action: 'create' | 'update';
}

const UserForm = ({
  user,
  roles,
  modulePermissions = {},
  userRoles = [],
  userDirectPermissions = [],
  action,
}: UserFormProps) => {
  const { data, setData, post, put, processing, errors } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    nickname: user?.nickname || '',
    roles: userRoles,
    permissions: userDirectPermissions,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (action === 'create') {
      post(route('admin.users.store'));
    } else if (user?.id) {
      put(route('admin.users.update', user.id));
    }
  };

  const toggleRole = (roleId: number) => {
    const newRoles = data.roles.includes(roleId)
      ? data.roles.filter(id => id !== roleId)
      : [...data.roles, roleId];

    setData('roles', newRoles);
  };

  const togglePermission = (permissionId: number) => {
    const newPermissions = data.permissions.includes(permissionId)
      ? data.permissions.filter(id => id !== permissionId)
      : [...data.permissions, permissionId];

    setData('permissions', newPermissions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="details">
        <TabsList className="w-full">
          <TabsTrigger value="details" className="flex-1">User Details</TabsTrigger>
          <TabsTrigger value="roles" className="flex-1">Roles</TabsTrigger>
          <TabsTrigger value="permissions" className="flex-1">Direct Permissions</TabsTrigger>
        </TabsList>

        {/* User Details Tab */}
        <TabsContent value="details" className="space-y-6 pt-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                required
              />
              {errors.name && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                required
              />
              {errors.email && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{errors.email}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={data.first_name}
                onChange={e => setData('first_name', e.target.value)}
              />
              {errors.first_name && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{errors.first_name}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={data.last_name}
                onChange={e => setData('last_name', e.target.value)}
              />
              {errors.last_name && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{errors.last_name}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                value={data.nickname}
                onChange={e => setData('nickname', e.target.value)}
              />
              {errors.nickname && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{errors.nickname}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">
                {action === 'create' ? 'Password' : 'New Password'} 
                {action === 'create' && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                required={action === 'create'}
              />
              {errors.password && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{errors.password}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">
                {action === 'create' ? 'Confirm Password' : 'Confirm New Password'} 
                {action === 'create' && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={e => setData('password_confirmation', e.target.value)}
                required={action === 'create'}
              />
            </div>
          </div>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>
                Assign roles to this user. Roles are collections of permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2 border p-4 rounded-md">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={data.roles.includes(role.id)}
                      onCheckedChange={() => toggleRole(role.id)}
                    />
                    <div>
                      <Label
                        htmlFor={`role-${role.id}`}
                        className="font-medium capitalize"
                      >
                        {role.name}
                      </Label>

                      <p className="text-sm text-muted-foreground">
                        {role.permissions?.length || 0} permissions
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {errors.roles && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{errors.roles}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Direct Permissions Tab */}
        <TabsContent value="permissions" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Direct Permissions</CardTitle>
              <CardDescription>
                Assign specific permissions directly to this user. These will override role permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(modulePermissions).map(([module, permissions]) => (
                  <div key={module} className="space-y-2">
                    <h3 className="text-lg font-medium capitalize">{module}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={data.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <Label
                            htmlFor={`permission-${permission.id}`}
                            className="text-sm font-normal"
                          >
                            {permission.display_name || permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {Object.keys(modulePermissions).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No permissions available.
                  </div>
                )}
              </div>
              {errors.permissions && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{errors.permissions}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit" disabled={processing}>
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {action === 'create' ? 'Creating...' : 'Updating...'}
            </>
          ) : (
            action === 'create' ? 'Create User' : 'Update User'
          )}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;