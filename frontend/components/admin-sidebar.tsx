"use client";

import type * as React from "react";
import {
  Users,
  DollarSign,
  FileText,
  BarChart3,
  Home,
  UserX,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Datos del menú principal
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "Gestión de Socios",
      url: "/admin/socios",
      icon: Users,
    },
    {
      title: "Eliminaciones",
      url: "/admin/eliminaciones",
      icon: UserX,
    },
    {
      title: "Control de Aportes",
      url: "/admin/aportes",
      icon: DollarSign,
    },
    {
      title: "Reportes",
      url: "/admin/reportes",
      icon: BarChart3,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-sidebar-primary-foreground">
                  <Users className="size-4 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ASODAT</span>
                  <span className="truncate text-xs">Panel Administrativo</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>|
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
