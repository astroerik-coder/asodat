"use client";

import type * as React from "react";
import {
  User,
  DollarSign,
  FileText,
  CreditCard,
  Settings,
  Home,
  Calendar,
  Bell,
  HelpCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Datos del menú para socios
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/socio/dashboard",
      icon: Home,
    },
    {
      title: "Mi Perfil",
      url: "/socio/perfil",
      icon: User,
    },
    {
      title: "Mis Aportes",
      url: "/socio/aportes",
      icon: DollarSign,
    },
  ],
};

interface SocioSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    nombre?: string;
    email?: string;
  };
}

export function SocioSidebar({ user, ...props }: SocioSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-sidebar-primary-foreground">
                  <User className="size-4 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ASODAT</span>
                  <span className="truncate text-xs">Panel de Socio</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
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
