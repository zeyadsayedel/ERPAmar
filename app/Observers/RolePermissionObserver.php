<?php

namespace App\Observers;

use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionObserver
{
    public function updated(Role $role): void
    {
        // Clear the permissions cache when a role is updated
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        
        // If there are users attached to this role, update their cached permissions
        if ($role->users()->exists()) {
            foreach ($role->users as $user) {
                $user->forgetCachedPermissions();
            }
        }
    }

    public function deleted(Role $role): void
    {
        // Clear the permissions cache when a role is deleted
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}