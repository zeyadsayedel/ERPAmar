// Add these methods to the User model

/**
 * Check if user has permissions for a specific module and action
 *
 * @param string $module The module name (e.g., 'user', 'car', 'quarry')
 * @param string $action The action name (e.g., 'create', 'view', 'list')
 * @return bool
 */
public function hasModulePermission(string $module, string $action): bool
{
    return $this->hasPermissionTo("{$module}:{$action}");
}

/**
 * Get all module permissions for a user
 *
 * @return array An array of modules with their available actions for the user
 */
public function getModulePermissions(): array
{
    $userPermissions = $this->getAllPermissions()->pluck('name')->toArray();
    $modulePermissions = [];
    
    foreach ($userPermissions as $permission) {
        if (strpos($permission, ':') !== false) {
            [$module, $action] = explode(':', $permission);
            
            if (!isset($modulePermissions[$module])) {
                $modulePermissions[$module] = [];
            }
            
            $modulePermissions[$module][] = $action;
        }
    }
    
    return $modulePermissions;
}

/**
 * Check if user can access a module
 * This checks if the user has any permissions for the given module
 *
 * @param string $module The module name
 * @return bool
 */
public function canAccessModule(string $module): bool
{
    $pattern = $module . ':';
    
    return $this->getAllPermissions()
        ->pluck('name')
        ->contains(function ($permission) use ($pattern) {
            return strpos($permission, $pattern) === 0;
        });
}

/**
 * Get a list of modules the user can access
 *
 * @return array The modules the user can access
 */
public function getAccessibleModules(): array
{
    $modulePermissions = $this->getModulePermissions();
    
    return array_keys($modulePermissions);
}

/**
 * Check if the user has at least one of the requested roles
 *
 * @param string|array $roles
 * @return bool
 */
public function hasAnySystemRole(string|array $roles): bool
{
    $roles = is_array($roles) ? $roles : [$roles];
    
    return $this->hasAnyRole($roles);
}

/**
 * Check if the user is a super admin
 * 
 * @return bool
 */
public function isSuperAdmin(): bool
{
    return $this->hasRole('super-admin');
}

/**
 * Check if the user is an admin or super admin
 * 
 * @return bool
 */
public function isAdmin(): bool
{
    return $this->hasAnyRole(['admin', 'super-admin']);
}
