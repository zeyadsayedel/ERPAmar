import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Permission } from '@/types/role';

interface PermissionsTableProps {
  permissions: Permission[];
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
}

export const PermissionsTable: React.FC<PermissionsTableProps> = ({
  permissions,
  onEdit,
  onDelete,
}) => {
  // Helper to get badge colors based on module
  const getModuleColor = (module: string): string => {
    const colors: Record<string, string> = {
      user: 'blue',
      role: 'purple',
      permission: 'violet',
      car: 'green',
      quarry: 'amber',
      dashboard: 'sky',
      system: 'red',
      general: 'gray',
    };
    
    return colors[module] || 'gray';
  };
  
  // Helper to get badge colors based on action
  const getActionColor = (action: string): string => {
    const colors: Record<string, string> = {
      create: 'green',
      update: 'blue',
      delete: 'red',
      view: 'sky',
      list: 'indigo',
      manage: 'purple',
    };
    
    return colors[action] || 'gray';
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Action</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No permissions found
              </TableCell>
            </TableRow>
          ) : (
            permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>{permission.display_name || permission.name}</TableCell>
                <TableCell>
                  {permission.module && (
                    <Badge variant="outline" className={`bg-${getModuleColor(permission.module)}-100 text-${getModuleColor(permission.module)}-800`}>
                      {permission.module}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {permission.action && (
                    <Badge variant="outline" className={`bg-${getActionColor(permission.action)}-100 text-${getActionColor(permission.action)}-800`}>
                      {permission.action}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(permission)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Permission</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the permission "{permission.display_name || permission.name}"?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(permission)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PermissionsTable;
