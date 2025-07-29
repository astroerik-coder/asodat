"use client"

import type * as React from "react"
import { Users, DollarSign, FileText, BarChart3, Settings, Home, Bell, HelpCircle } from "lucide-react"

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
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
      items: [
        {
          title: "Ver Todos",
          url: "/admin/socios",
        },
        {
          title: "Nuevo Socio",
          url: "/admin/socios/nuevo",
        },
        {
          title: "Solicitudes Pendientes",
          url: "/admin/socios/solicitudes",
        },
      ],
    },
    {
      title: "Control de Aportes",
      url: "/admin/aportes",
      icon: DollarSign,
      items: [
        {
          title: "Ver Aportes",
          url: "/admin/aportes",
        },
        {
          title: "Registrar Pago",
          url: "/admin/aportes/registrar",
        },
        {
          title: "Morosos",
          url: "/admin/aportes/morosos",
        },
      ],
    },
    {
      title: "Comprobantes",
      url: "/admin/comprobantes",
      icon: FileText,
      items: [
        {
          title: "Ver Comprobantes",
          url: "/admin/comprobantes",
        },
        {
          title: "Generar Comprobante",
          url: "/admin/comprobantes/generar",
        },
      ],
    },
    {
      title: "Reportes",
      url: "/admin/reportes",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "/admin/configuracion",
      icon: Settings,
    },
    {
      title: "Notificaciones",
      url: "/admin/notificaciones",
      icon: Bell,
    },
    {
      title: "Ayuda",
      url: "/admin/ayuda",
      icon: HelpCircle,
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                  {item.items?.length ? (
                    <SidebarMenu className="ml-4 border-l border-sidebar-border pl-4">
                      {item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild size="sm">
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm">
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-indigo-100 text-indigo-600">AD</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Administrador</span>
                  <span className="truncate text-xs">admin@asodat.org</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
