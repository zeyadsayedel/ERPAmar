import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Building, Car, Folder, LayoutGrid, Users, Shield, Key } from 'lucide-react';
import { PermissionChecker } from '@/components/Permission';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    { title: 'Cars', href: '/cars', icon: Car },
    { title: 'Quarries', href: '/quarries', icon: Building },
];

// Admin menu items with required permissions
const adminNavItems: Array<NavItem & { permission: string }> = [
    {
        title: 'User Management',
        href: '/admin/users',
        icon: Users,
        permission: 'user:list'
    },
    {
        title: 'Roles',
        href: '/admin/roles',
        icon: Shield,
        permission: 'role:list'
    },
    {
        title: 'Permissions',
        href: '/admin/permissions',
        icon: Key,
        permission: 'permission:list'
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    // Check if user has any admin permissions
    const { auth } = usePage().props;
    const userPermissions = auth?.user?.permissions || [];
    
    // Helper to check if the admin section should be shown
    const hasAnyAdminPermission = adminNavItems.some(
        item => userPermissions.includes(item.permission)
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                
                {/* Conditionally render Admin section */}
                {hasAnyAdminPermission && (
                    <>
                        {/* Admin section header */}
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <h3 className="text-xs font-medium text-foreground/80 py-2">
                                    Administration
                                </h3>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        
                        {/* Admin menu items */}
                        <SidebarMenu>
                            {adminNavItems.map((item) => (
                                <PermissionChecker key={item.href} permission={item.permission}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.href}>
                                                {item.icon && <item.icon className="h-4 w-4" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </PermissionChecker>
                            ))}
                        </SidebarMenu>
                    </>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}