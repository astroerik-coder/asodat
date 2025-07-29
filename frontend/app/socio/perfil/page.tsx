"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SocioSidebar } from "@/components/socio-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { User, LogOut, Bell, Edit } from "lucide-react"

const mockSocioData = {
  cedula: "0987654321",
  apellidos_nombres: "García López, María Elena",
  campus: "Latacunga",
  genero: "F",
  regimen: "Tiempo Completo",
  celular: "0987654321",
  cargo: "Docente Titular",
  fecha_afiliacion: "2020-03-15",
  tipo_usuario: "fundador",
  correo: "maria.garcia@espe.edu.ec",
  direccion: "Av. Principal 123, Latacunga",
}

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.tipo === "admin") {
      router.push("/admin/dashboard")
      return
    }

    setUser(parsedUser)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  return (
    <SidebarProvider>
      <SocioSidebar user={{ nombre: mockSocioData.apellidos_nombres, email: mockSocioData.correo }} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/socio/dashboard">Mi Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Mi Perfil</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Badge variant="outline">Socio {mockSocioData.tipo_usuario}</Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <User className="h-6 w-6 text-indigo-600 mr-3" />
                    <div>
                      <CardTitle>Mi Información Personal</CardTitle>
                      <CardDescription>Sus datos registrados en el sistema ASODAT</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Solicitar Actualización
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nombres y Apellidos</label>
                      <p className="text-lg font-semibold mt-1">{mockSocioData.apellidos_nombres}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Cédula de Identidad</label>
                      <p className="text-lg mt-1">{mockSocioData.cedula}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Campus</label>
                      <p className="text-lg mt-1">{mockSocioData.campus}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Cargo</label>
                      <p className="text-lg mt-1">{mockSocioData.cargo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tipo de Usuario</label>
                      <div className="mt-1">
                        <Badge variant={mockSocioData.tipo_usuario === "fundador" ? "default" : "secondary"}>
                          {mockSocioData.tipo_usuario}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Correo Electrónico</label>
                      <p className="text-lg mt-1">{mockSocioData.correo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Celular</label>
                      <p className="text-lg mt-1">{mockSocioData.celular}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Régimen Laboral</label>
                      <p className="text-lg mt-1">{mockSocioData.regimen}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha de Afiliación</label>
                      <p className="text-lg mt-1">{mockSocioData.fecha_afiliacion}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Género</label>
                      <p className="text-lg mt-1">{mockSocioData.genero === "M" ? "Masculino" : "Femenino"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dirección</label>
                    <p className="text-lg mt-1">{mockSocioData.direccion}</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Información Importante:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Para actualizar sus datos, debe solicitar la modificación al administrador</li>
                    <li>• Los cambios en información personal requieren documentación de respaldo</li>
                    <li>• Su información se mantiene confidencial según las políticas de ASODAT</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
