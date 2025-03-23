import React from 'react';
import { Link } from '@inertiajs/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Edit } from 'lucide-react';
import { PermissionChecker } from '@/components/Permission';
import { Role, Permission } from '@/types/role';

interface User {
  id: number;
  name: string;
  email: string;
  first_name?: string;
  last_name?: string;
  nickname?: string;
  display_name?: string;
  user_login?: string;
  user_nicename?: string;
  user_url?: string;
  description?: string;
  roles: Role[];
  permissions: Permission[];
  created_at: string;
  updated_at: string;
  email_verified_at?: string;
}

interface UserRolesSummary {
  id: number;
  name: string;
  email: string;
  roles: Array<{
    id: number;
    name: string;
  }>;
  direct_permissions: Array<{
    id: number;
    name: string;
  }>;
  all_permissions: Array<{
    id: number;
    name: string;
  }>;
}

interface UserProfileProps {
  user: User;
  userRolesSummary?: UserRolesSummary;
  userPermissions: Record<string, boolean>;
}

const UserProfile = ({ user, userRolesSummary, userPermissions }: UserProfileProps) => {
  const canUpdate = userPermissions.update ?? false;
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Group permissions by module for display
  const groupPermissionsByModule = (permissions: Permission[]) => {
    const grouped: Record<string, Permission[]> = {};

    permissions.forEach(permission => {
      const parts = permission.name.split(':');
      const module = parts[0] || 'other';

      if (!grouped[module]) {
        grouped[module] = [];
      }

      grouped[module].push(permission);
    });

    return grouped;
  };

  // Format permission name for display
  const formatPermissionName = (permission: Permission) => {
    const parts = permission.name.split(':');
    if (parts.length > 1) {
      return parts[1]; // Just show the action part
    }
    return permission.name;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Profile</h2>
        
        {/* Use our simplified PermissionChecker that directly checks permissions */}
        <PermissionChecker permission="user:update">
          <Button asChild>
            <Link href={route('admin.users.edit', user.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Link>
          </Button>
        </PermissionChecker>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* User Details Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Basic user account details</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-lg font-semibold">{user.name}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-base">{user.email}</dd>
              </div>

              {user.first_name && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">First Name</dt>
                  <dd className="text-base">{user.first_name}</dd>
                </div>
              )}

              {user.last_name && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Last Name</dt>
                  <dd className="text-base">{user.last_name}</dd>
                </div>
              )}

              {user.nickname && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Nickname</dt>
                  <dd className="text-base">{user.nickname}</dd>
                </div>
              )}

              {user.display_name && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Display Name</dt>
                  <dd className="text-base">{user.display_name}</dd>
                </div>
              )}

              <Separator />

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Account Created</dt>
                <dd className="text-base">{formatDate(user.created_at)}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                <dd className="text-base">{formatDate(user.updated_at)}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email Verified</dt>
                <dd className="text-base">
                  {user.email_verified_at ? (
                    <span className="text-green-600">
                      {formatDate(user.email_verified_at)}
                    </span>
                  ) : (
                    <span className="text-amber-600">Not verified</span>
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Roles and Permissions Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>User access levels and capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Roles Section */}
              <div>
                <h3 className="text-lg font-medium mb-2">Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {user.roles.length > 0 ? (
                    user.roles.map(role => (
                      <Badge key={role.id} className="px-3 py-1 text-sm">
                        {role.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No roles assigned</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Direct Permissions Section */}
              <div>
                <h3 className="text-lg font-medium mb-2">Direct Permissions</h3>
                {user.permissions.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(groupPermissionsByModule(user.permissions)).map(([module, permissions]) => (
                      <div key={module}>
                        <h4 className="text-sm font-medium text-muted-foreground capitalize mb-2">
                          {module}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {permissions.map(permission => (
                            <Badge
                              key={permission.id}
                              variant="outline"
                              className="px-2 py-1 text-xs"
                            >
                              {formatPermissionName(permission)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No direct permissions assigned</p>
                )}
              </div>

              {userRolesSummary && (
                <>
                  <Separator />

                  {/* All Effective Permissions */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">All Effective Permissions</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Includes permissions from roles and direct assignments.
                    </p>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Module</TableHead>
                          <TableHead>Permissions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(groupPermissionsByModule(userRolesSummary.all_permissions)).map(([module, permissions]) => (
                          <TableRow key={module}>
                            <TableCell className="font-medium capitalize">{module}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {permissions.map(permission => (
                                  <Badge
                                    key={permission.id}
                                    variant="outline"
                                    className="px-2 py-0.5 text-xs"
                                  >
                                    {formatPermissionName(permission)}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;