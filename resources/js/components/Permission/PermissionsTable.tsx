import React, { useState, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Plus,
  Search,
  X,
  Settings,
  Pencil,
  Trash,
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
import type { Permission } from '@/types/role';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  createPermission?: string;
  createRoute?: string;
  createLabel?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder = "Search...",
  createPermission,
  createRoute,
  createLabel = "Create",
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const searchColumnInstance = useMemo(() => {
    return searchColumn ? table.getColumn(searchColumn) : null;
  }, [table, searchColumn]);

  const filterValue = searchColumnInstance?.getFilterValue() as string;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {searchColumnInstance && (
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={filterValue ?? ""}
              onChange={(event) => searchColumnInstance.setFilterValue(event.target.value)}
              className="h-9 w-[250px] sm:w-[300px]"
            />
            {filterValue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => searchColumnInstance.setFilterValue("")}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {createPermission && createRoute && (
          <Button asChild>
            <Link href={createRoute}>
              <Plus className="h-4 w-4 mr-2" />
              {createLabel}
            </Link>
          </Button>
        )}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Rows per page
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium">Page</p>
            <span className="text-sm font-medium">
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export interface ModulePermissionsProps {
  permissions: Record<string, Permission[]>;
  readOnly?: boolean;
  onDelete?: (permission: Permission) => void;
  onEdit?: (permission: Permission) => void;
}

export function PermissionsTable({ 
  permissions, 
  readOnly = true, 
  onDelete, 
  onEdit 
}: ModulePermissionsProps) {
  // Ensure permissions is an object and not null or undefined
  const permissionsData = permissions || {};
  
  // Handle permission deletion
  const handleDelete = (permission: Permission) => {
    if (onDelete) {
      onDelete(permission);
    } else {
      // Default delete behavior if no custom handler provided
      router.delete(route('admin.permissions.destroy', permission.id), {
        preserveScroll: true,
        onSuccess: () => {
          // Success notification handled by Inertia flash messages
        },
      });
    }
  };
  
  // Handle permission edit
  const handleEdit = (permission: Permission) => {
    if (onEdit) {
      onEdit(permission);
    } else {
      // Default edit behavior if no custom handler provided
      router.visit(route('admin.permissions.edit', permission.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* {!readOnly && (
        <div className="flex justify-end">
          <Button asChild>
            <Link href={route('admin.permissions.create')}>
              <Plus className="h-4 w-4 mr-2" />
              Register Module
            </Link>
          </Button>
        </div>
      )} */}

      <div className="grid gap-6">
        {Object.entries(permissionsData).map(([module, modulePermissions]) => {
          // Ensure modulePermissions is an array
          const permissionsList = Array.isArray(modulePermissions) ? modulePermissions : [];
          
          return (
            <Card key={module} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium capitalize">{module}</h3>
                  <p className="text-sm text-muted-foreground">
                    {permissionsList.length} permission{permissionsList.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {!readOnly && (
                  <div className="flex space-x-2">
                    {/* Add Permission button */}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={route('admin.permissions.create', { module })}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Permission
                      </Link>
                    </Button>
                    
                    {/* Manage Module button */}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={route('admin.permissions.module', module)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {permissionsList.map((permission) => {
                  const parts = permission.name.split(':');
                  const action = parts.length > 1 ? parts[1] : permission.name;
                  
                  return (
                    <div 
                      key={permission.id} 
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <Badge 
                        variant="secondary"
                        className="text-sm"
                      >
                        {action}
                      </Badge>
                      
                      {!readOnly && (
                        <div className="flex space-x-1">
                          {/* Edit button */}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEdit(permission)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          {/* Delete button with confirmation */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0"
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
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {permissionsList.length === 0 && (
                  <div className="col-span-full">
                    <p className="text-sm text-muted-foreground">No permissions in this module</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {Object.keys(permissionsData).length === 0 && (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              No permissions found. Start by registering a module.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}