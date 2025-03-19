import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import PermissionChecker from '@/components/Permission/PermissionChecker';
import {
  Car,
  Mountain,
  Users,
  Shield,
  Lock,
  Home,
  Settings,
  LucideIcon,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: route('dashboard'), icon: Home },
  { name: 'Cars', href: route('cars.index'), icon: Car, permission: 'car:list' },
  { name: 'Quarries', href: route('quarries.index'), icon: Mountain, permission: 'quarry:list' },
  { name: 'Users', href: route('admin.users.index'), icon: Users, permission: 'user:list' },
  { name: 'Roles', href: route('admin.roles.index'), icon: Shield, permission: 'role:list' },
  { name: 'Permissions', href: route('admin.permissions.index'), icon: Lock, permission: 'permission:list' },
  { name: 'Settings', href: route('settings.index'), icon: Settings, permission: 'settings:view' },
];

const SidebarMenu = () => {
  const { url } = usePage();

  return (
    <nav className="space-y-1 px-2">
      {navigation.map((item) => {
        const isActive = url.startsWith(item.href);
        const NavItem = () => (
          <Link
            href={item.href}
            className={cn(
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
              isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon
              className={cn(
                'mr-3 h-5 w-5',
                isActive
                  ? 'text-gray-500'
                  : 'text-gray-400 group-hover:text-gray-500'
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        );

        return item.permission ? (
          <PermissionChecker key={item.name} permission={item.permission}>
            <NavItem />
          </PermissionChecker>
        ) : (
          <NavItem key={item.name} />
        );
      })}
    </nav>
  );
};

export default SidebarMenu;
