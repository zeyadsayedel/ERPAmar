import React from 'react';
import { Link, router } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from '@/components/ui/alert-dialog';
import {
  Edit,
  Eye,
  Plus,
  Search,
  Trash,
  X,
  Download,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { PermissionChecker } from '@/components/Permission';
import { Role } from '@/types/role';

interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  created_at: string;
}

interface UsersTableProps {
  users: {
    data: User[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
  filters: {
    search: string;
    role: string;
    sortField: string;
    sortDirection: string;
  };
  roles: Role[];
}

const UsersTable = ({ users, filters, roles }: UsersTableProps) => {
  console.log(users);
  const [search, setSearch] = React.useState(filters.search || '');
  const [selectedRole, setSelectedRole] = React.useState(filters.role || 'all');
  const [sortField, setSortField] = React.useState(filters.sortField || 'created_at');
  const [sortDirection, setSortDirection] = React.useState(filters.sortDirection || 'desc');
  const [isSearching, setIsSearching] = React.useState(false);

  const applyFilters = () => {
    setIsSearching(true);
    router.get(
      route('admin.users.index'),
      {
        search,
        role: selectedRole,
        sort_field: sortField,
        sort_direction: sortDirection,
      },
      {
        preserveState: true,
        onSuccess: () => setIsSearching(false),
        onError: () => setIsSearching(false),
      }
    );
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedRole('');
    setSortField('created_at');
    setSortDirection('desc');

    router.get(
      route('admin.users.index'),
      {},
      {
        preserveState: true,
      }
    );
  };

  const handleSort = (field: string) => {
    // If already sorting by this field, toggle direction
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Otherwise, set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }

    // Apply sort immediately
    router.get(
      route('admin.users.index'),
      {
        search,
        role: selectedRole,
        sort_field: field,
        sort_direction: sortField === field && sortDirection === 'asc' ? 'desc' : 'asc',
      },
      {
        preserveState: true,
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = (userId: number) => {
    router.delete(route('admin.users.destroy', userId), {
      preserveScroll: true,
    });
  };

  // Function to determine the sorting icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;

    return sortDirection === 'asc' ? (
      <span className="inline-block ml-1">▲</span>
    ) : (
      <span className="inline-block ml-1">▼</span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSearching}
            />
            {search && (
              <Button
                variant="ghost"
                className="absolute right-0 top-0 h-9 w-9 p-0"
                onClick={() => {
                  setSearch('');
                  if (filters.search) applyFilters();
                }}
                disabled={isSearching}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Role Filter */}
          <div className="w-full sm:w-48">
            <Select
              value={selectedRole}
              onValueChange={(value) => {
                setSelectedRole(value);
                // Apply filter immediately when role changes
                router.get(
                  route('admin.users.index'),
                  {
                    search,
                    role: value, // Pass role value directly
                    sort_field: sortField,
                    sort_direction: sortDirection,
                  },
                  {
                    preserveState: true,
                  }
                );
              }}
              disabled={isSearching}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={applyFilters} disabled={isSearching}>
              {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Filter'}
            </Button>
            <Button variant="outline" onClick={resetFilters} disabled={isSearching}>
              Reset
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <PermissionChecker permission="user:export">
            <Button variant="outline" asChild>
              <Link href={route('admin.users.export')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Link>
            </Button>
          </PermissionChecker>

          <PermissionChecker permission="user:import">
            <Button variant="outline" asChild>
              <Link href={route('admin.users.import')}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Link>
            </Button>
          </PermissionChecker>

          <PermissionChecker permission="user:create">
            <Button asChild>
              <Link href={route('admin.users.create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create User
              </Link>
            </Button>
          </PermissionChecker>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name {getSortIcon('name')}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('email')}
              >
                Email {getSortIcon('email')}
              </TableHead>
              <TableHead>Roles</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                Created {getSortIcon('created_at')}
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <Badge key={role.id} variant="secondary">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <PermissionChecker permission="user:view">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={route('admin.users.show', user.id)}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </PermissionChecker>

                    <PermissionChecker permission="user:update">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={route('admin.users.edit', user.id)}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </PermissionChecker>

                    <PermissionChecker permission="user:delete">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this user? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(user.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </PermissionChecker>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {users.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No users found. Try adjusting your filters or create a new user.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {users && users.last_page > 1 && (
        <div className="flex items-center justify-center gap-1 py-4">
          {users.links.map((link, index) => {
            // Skip "Previous" and "Next" links
            if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
              return null;
            }

            return (
              <Button
                key={index}
                variant={link.active ? 'default' : 'outline'}
                size="sm"
                disabled={!link.url}
                onClick={() => {
                  if (link.url) {
                    // Extract URL params if needed
                    window.location.href = link.url;
                  }
                }}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UsersTable;