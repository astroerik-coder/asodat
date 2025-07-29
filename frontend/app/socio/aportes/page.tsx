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
import { DollarSign, LogOut, Bell, CreditCard } from "lucide-react"
import Link from "next/link"

const mockSocioData = {
  cedula: "0987654321",
  apellidos_nombres: "García López, María Elena",
  correo: "maria.garcia@espe.edu.ec",
}

const mockAportes = {
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
}

export default function AportesSocioPage() {
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

  const obtenerMesesPendientes = () => {
    const meses = [
      { nombre: "Enero", valor: mockAportes.enero },
      { nombre: "Febrero", valor: mockAportes.febrero },
      { nombre: "Marzo", valor: mockAportes.marzo },
      { nombre: "Abril", valor: mockAportes.abril },
      { nombre: "Mayo", valor: mockAportes.mayo },
      { nombre: "Junio", valor: mockAportes.junio },
    ]
    return meses.filter((mes) => mes.valor === 0)
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
                  <BreadcrumbPage>Mis Aportes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Badge variant="outline">Socio</Badge>
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
                    <DollarSign className="h-6 w-6 text-indigo-600 mr-3" />
                    <div>
                      <CardTitle>Estado de Aportes 2024</CardTitle>
                      <CardDescription>Resumen detallado de sus aportes mensuales</CardDescription>
                    </div>
                  </div>
                  {obtenerMesesPendientes().length > 0 && (
                    <Link href="/socio/pagos">
                      <Button>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Realizar Pago
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                  {[
                    { mes: "Enero", valor: mockAportes.enero },
                    { mes: "Febrero", valor: mockAportes.febrero },
                    { mes: "Marzo", valor: mockAportes.marzo },
                    { mes: "Abril", valor: mockAportes.abril },
                    { mes: "Mayo", valor: mockAportes.mayo },
                    { mes: "Junio", valor: mockAportes.junio },
                    { mes: "Julio", valor: mockAportes.julio },
                    { mes: "Agosto", valor: mockAportes.agosto },
                    { mes: "Septiembre", valor: mockAportes.septiembre },
                    { mes: "Octubre", valor: mockAportes.octubre },
                    { mes: "Noviembre", valor: mockAportes.noviembre },
                    { mes: "Diciembre", valor: 0.0 },
                  ].map((item) => (
                    <div key={item.mes} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="text-sm font-medium text-gray-600 mb-2">{item.mes}</div>
                      <div className={`text-xl font-bold mb-2 ${item.valor > 0 ? "text-green-600" : "text-red-600"}`}>
                        ${item.valor.toFixed(2)}
                      </div>
                      <Badge variant={item.valor > 0 ? "default" : "destructive"} className="text-xs">
                        {item.valor > 0 ? "Pagado" : "Pendiente"}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          $
                          {[mockAportes.enero, mockAportes.febrero, mockAportes.marzo, mockAportes.mayo]
                            .reduce((a, b) => a + b, 0)
                            .toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-600">Total Pagado</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          ${(obtenerMesesPendientes().length * 25).toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-600">Total Pendiente</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          ${mockAportes.nuevos_ingresos.toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-600">Ingreso Inicial</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {obtenerMesesPendientes().length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Meses Pendientes de Pago:</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {obtenerMesesPendientes().map((mes) => (
                        <Badge key={mes.nombre} variant="destructive">
                          {mes.nombre} - $25.00
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-yellow-700">
                      Recuerde que los aportes mensuales son de $25.00. Manténgase al día con sus pagos para disfrutar
                      de todos los beneficios de ASODAT.
                    </p>
                  </div>
                )}

                {obtenerMesesPendientes().length === 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <h4 className="font-semibold text-green-800 mb-2">¡Felicitaciones!</h4>
                    <p className="text-green-700">Está al día con todos sus aportes mensuales.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
