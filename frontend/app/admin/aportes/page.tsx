"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { DollarSign, Search, Download, LogOut, Bell, Plus } from "lucide-react"
import Link from "next/link"

const mockAportes = [
  {
    cedula: "0987654321",
    apellidos_y_nombres: "García López, María Elena",
    nuevos_ingresos: 50.0,
    enero: 25.0,
    febrero: 25.0,
    marzo: 25.0,
    abril: 0.0,
    mayo: 25.0,
    junio: 0.0,
    julio: 0.0,
    agosto: 0.0,
    septiembre: 0.0,
    octubre: 0.0,
    noviembre: 0.0,
  },
  {
    cedula: "1234567890",
    apellidos_y_nombres: "Rodríguez Pérez, Carlos Alberto",
    nuevos_ingresos: 50.0,
    enero: 25.0,
    febrero: 25.0,
    marzo: 0.0,
    abril: 0.0,
    mayo: 0.0,
    junio: 0.0,
    julio: 0.0,
    agosto: 0.0,
    septiembre: 0.0,
    octubre: 0.0,
    noviembre: 0.0,
  },
]

export default function AportesPage() {
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
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

  const filteredAportes = mockAportes.filter(
    (aporte) =>
      aporte.apellidos_y_nombres.toLowerCase().includes(searchTerm.toLowerCase()) || aporte.cedula.includes(searchTerm),
  )

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
                  <BreadcrumbPage>Control de Aportes</BreadcrumbPage>
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
                    <CardTitle>Control de Aportes</CardTitle>
                    <CardDescription>Gestione los aportes mensuales de los socios</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/admin/aportes/registrar">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Registrar Pago
                      </Button>
                    </Link>
                    <Link href="/admin/aportes/morosos">
                      <Button variant="outline">Ver Morosos</Button>
                    </Link>
                  </div>
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
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>

                {/* Lista de Aportes */}
                <div className="space-y-4">
                  {filteredAportes.length > 0 ? (
                    filteredAportes.map((aporte) => (
                      <div key={aporte.cedula} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold">{aporte.apellidos_y_nombres}</h3>
                          <Badge variant="outline">Cédula: {aporte.cedula}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Ingreso:</span>
                            <div className="font-medium">${aporte.nuevos_ingresos.toFixed(2)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Enero:</span>
                            <div className={`font-medium ${aporte.enero > 0 ? "text-green-600" : "text-red-600"}`}>
                              ${aporte.enero.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Febrero:</span>
                            <div className={`font-medium ${aporte.febrero > 0 ? "text-green-600" : "text-red-600"}`}>
                              ${aporte.febrero.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Marzo:</span>
                            <div className={`font-medium ${aporte.marzo > 0 ? "text-green-600" : "text-red-600"}`}>
                              ${aporte.marzo.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Abril:</span>
                            <div className={`font-medium ${aporte.abril > 0 ? "text-green-600" : "text-red-600"}`}>
                              ${aporte.abril.toFixed(2)} {aporte.abril === 0 && "(Pendiente)"}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Mayo:</span>
                            <div className={`font-medium ${aporte.mayo > 0 ? "text-green-600" : "text-red-600"}`}>
                              ${aporte.mayo.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button variant="outline" size="sm">
                            Ver Detalle
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros de aportes</h3>
                      <p className="text-gray-600">Los aportes aparecerán aquí una vez que se registren</p>
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
