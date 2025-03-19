import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  Home,
  Users,
  Shield,
  Car,
  Tool,
  Settings,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleAccess {
  label: string;
  required_permission: string;
  route: string;
  icon: string;
  has_access: boolean;
}

interface PageProps {
  auth: {
    user: {
      module_access?: Record<string, ModuleAccess>;
    };
  };
}

// Map of icon names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  users: Users,
  shield: Shield,
  car: Car,
  tool: Tool,
  settings: Settings,
};

interface SidebarMenuProps {
  className?: string;
}

export function SidebarMenu({ className }: SidebarMenuProps) {
  const { auth } = usePage<PageProps>().props;
  const { module_access } = auth.user;
  
  // If module_access isn't provided, show default items
  const defaultModules = [
    {
      label: 'Dashboard',
      route: 'dashboard',
      icon: 'home',
      has_access: true,
    },
    {
      label: 'Users',
      route: 'users.index',
      icon: 'users',
      has_access: true,
    },
    {
      label: 'Roles',
      route: 'admin.roles.index',
      icon: 'shield',
      has_access: true,
    },
    {
      label: 'Cars',
      route: 'cars.index',
      icon: 'car',
      has_access: true,
    },
    {
      label: 'Quarries',
      route: 'quarries.index',
      icon: 'tool',
      has_access: true,
    },
    {
      label: 'Settings',
      route: 'settings.profile.edit',
      icon: 'settings',
      has_access: true,
    },
  ];
  
  const modules = module_access || defaultModules;

  return (
    <nav className={cn("space-y-2", className)}>
      {Object.entries(modules)
        .filter(([_, module]) => module.has_access)
        .map(([key, module]) => {
          const Icon = iconMap[module.icon] || Home;
          return (
            <Link
              key={key}
              href={route(module.route)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                route().current(module.route + '*') 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{module.label}</span>
            </Link>
          );
      })}
    </nav>
  );
}

export default SidebarMenu;
