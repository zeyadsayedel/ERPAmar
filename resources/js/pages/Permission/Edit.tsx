import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import PermissionDataTable from '@/components/Permission/PermissionDataTable';
import type { Permission } from '@/types/permission';

interface EditProps {
  permissions: Permission[];
}

export default function Edit({ permissions }: EditProps) {
  const handleTogglePermission = (permission: Permission) => {
    router.put(route('permissions.update', permission.id), {
      active: !permission.active
    });
  };

  return (
    <AppLayout>
      <Head title="Edit Permissions" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-background overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Manage Permissions</h2>
              <PermissionDataTable
                permissions={permissions}
                onTogglePermission={handleTogglePermission}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}