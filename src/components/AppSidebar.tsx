import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  ScrollText,
  Users,
  FileText,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Live Map',
    url: '/live-map',
    icon: Map,
  },
  {
    title: 'Incident Logs',
    url: '/incident-logs',
    icon: ScrollText,
  },
];

const adminItems = [
  {
    title: 'User Management',
    url: '/admin/users',
    icon: Users,
  },
  {
    title: 'Audit Logs',
    url: '/admin/audit-logs',
    icon: FileText,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <h2 className="text-lg font-bold bg-gradient-to-r from-critical via-warning to-primary bg-clip-text text-transparent">
          V2X Command Center
        </h2>
        <p className="text-xs text-muted-foreground">Emergency Response Dashboard</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-accent/50'
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-accent/50'
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
