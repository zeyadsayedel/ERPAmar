import {
  Car,
  Mountain,
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export default function Navigation() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-16 items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
          <span className="text-lg font-medium">ERP Amar</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              href={route('dashboard')}
              data-active={route().current('dashboard')}
              icon={LayoutDashboard}
            >
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              href={route('cars.index')}
              data-active={route().current('cars.*')}
              icon={Car}
            >
              Cars
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              href={route('quarries.index')}
              data-active={route().current('quarries.*')}
              icon={Mountain}
            >
              Quarries
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              href={route('settings.profile')}
              data-active={route().current('settings.*')}
              icon={Settings}
            >
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}