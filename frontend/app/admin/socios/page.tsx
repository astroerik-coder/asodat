"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Users, Plus, Search, Download, LogOut, Bell } from "lucide-react"
import Link from "next/link"

// Datos simulados
const mockSocios = [
  {
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
  },
  {
    cedula: "1234567890",
    apellidos_nombres: "Rodríguez Pérez, Carlos Alberto",
    campus: "Latacunga",
    genero: "M",
    regimen: "Medio Tiempo",
    celular: "0912345678",
    cargo: "Docente Auxiliar",
    fecha_afiliacion: "2021-08-20",
    tipo_usuario: "adherente",
    correo: "carlos.rodriguez@espe.edu.ec",
  },
]

export default function SociosPage() {
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCampus, setFilterCampus] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.tipo !== "admin") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const filteredSocios = mockSocios.filter((socio) => {
    const matchesSearch =
      socio.apellidos_nombres.toLowerCase().includes(searchTerm.toLowerCase()) || socio.cedula.includes(searchTerm)
    const matchesCampus = filterCampus === "all" || socio.campus === filterCampus
    return matchesSearch && matchesCampus
  })

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">Administración</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Gestión de Socios</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Badge variant="secondary">Administrador</Badge>
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
                  <div>
                    <CardTitle>Gestión de Socios</CardTitle>
                    <CardDescription>Administre la información de los socios registrados</CardDescription>
                  </div>
                  <Link href="/admin/socios/nuevo">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Socio
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nombre o cédula..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterCampus} onValueChange={setFilterCampus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filtrar por campus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los campus</SelectItem>
                      <SelectItem value="Latacunga">Latacunga</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>

                {/* Lista de Socios */}
                <div className="space-y-4">
                  {filteredSocios.length > 0 ? (
                    filteredSocios.map((socio) => (
                      <div key={socio.cedula} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{socio.apellidos_nombres}</h3>
                              <Badge variant={socio.tipo_usuario === "fundador" ? "default" : "secondary"}>
                                {socio.tipo_usuario}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                              <div>Cédula: {socio.cedula}</div>
                              <div>Campus: {socio.campus}</div>
                              <div>Cargo: {socio.cargo}</div>
                              <div>Celular: {socio.celular}</div>
                              <div>Email: {socio.correo}</div>
                              <div>Afiliación: {socio.fecha_afiliacion}</div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Link href="/admin/aportes">
                              <Button variant="outline" size="sm">
                                Ver Aportes
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron socios</h3>
                      <p className="text-gray-600">
                        {searchTerm || filterCampus !== "all"
                          ? "Intente ajustar los filtros de búsqueda"
                          : "Comience agregando el primer socio al sistema"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
