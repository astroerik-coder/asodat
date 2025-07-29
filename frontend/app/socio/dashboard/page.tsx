"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SocioSidebar } from "@/components/socio-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { User, DollarSign, FileText, Calendar, LogOut, Eye, Download, CreditCard, Bell } from "lucide-react"

// Datos simulados del socio actual
const mockSocioData = {
  cedula: "0987654321",
  apellidos_nombres: "García López, María Elena",
  campus: "Guayaquil",
  genero: "F",
  regimen: "Tiempo Completo",
  celular: "0987654321",
  cargo: "Docente Titular",
  fecha_afiliacion: "2020-03-15",
  tipo_usuario: "fundador",
  correo: "maria.garcia@universidad.edu.ec",
  direccion: "Av. Principal 123, Guayaquil",
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

const mockComprobantes = [
  {
    id: 1,
    numero_comprobante: 1001,
    fecha_pago: "2024-03-15",
    total: 25.0,
    meses_vencidos: "Marzo 2024",
    observaciones: "Pago mensual regular",
  },
  {
    id: 2,
    numero_comprobante: 1002,
    fecha_pago: "2024-02-15",
    total: 25.0,
    meses_vencidos: "Febrero 2024",
    observaciones: "Pago mensual regular",
  },
]

export default function SocioDashboard() {
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

  const calcularTotalAportes = () => {
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
    ]
    return meses.reduce((total, mes) => total + ((mockAportes[mes as keyof typeof mockAportes] as number) || 0), 0)
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
                  <BreadcrumbLink href="/socio">Mi Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
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
          {/* Stats Cards */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Aportado</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${calcularTotalAportes().toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Este año</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meses Pendientes</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{obtenerMesesPendientes().length}</div>
                <p className="text-xs text-muted-foreground">Por pagar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comprobantes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockComprobantes.length}</div>
                <p className="text-xs text-muted-foreground">Generados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estado</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Activo</div>
                <p className="text-xs text-muted-foreground">Desde {mockSocioData.fecha_afiliacion}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <Tabs defaultValue="perfil" className="p-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="perfil">Mi Perfil</TabsTrigger>
                <TabsTrigger value="aportes">Mis Aportes</TabsTrigger>
                <TabsTrigger value="comprobantes">Comprobantes</TabsTrigger>
                <TabsTrigger value="pagos">Realizar Pago</TabsTrigger>
              </TabsList>

              <TabsContent value="perfil" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Sus datos registrados en el sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Nombres y Apellidos</label>
                          <p className="text-lg font-semibold">{mockSocioData.apellidos_nombres}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Cédula</label>
                          <p className="text-lg">{mockSocioData.cedula}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Campus</label>
                          <p className="text-lg">{mockSocioData.campus}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Cargo</label>
                          <p className="text-lg">{mockSocioData.cargo}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Correo Electrónico</label>
                          <p className="text-lg">{mockSocioData.correo}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Celular</label>
                          <p className="text-lg">{mockSocioData.celular}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Régimen</label>
                          <p className="text-lg">{mockSocioData.regimen}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Fecha de Afiliación</label>
                          <p className="text-lg">{mockSocioData.fecha_afiliacion}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button variant="outline">Solicitar Actualización de Datos</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="aportes" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Estado de Aportes 2024</CardTitle>
                    <CardDescription>Resumen de sus aportes mensuales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                      ].map((item) => (
                        <div key={item.mes} className="text-center p-4 border rounded-lg">
                          <div className="text-sm font-medium text-gray-600">{item.mes}</div>
                          <div className={`text-lg font-bold ${item.valor > 0 ? "text-green-600" : "text-red-600"}`}>
                            ${item.valor.toFixed(2)}
                          </div>
                          <Badge variant={item.valor > 0 ? "default" : "destructive"} className="text-xs">
                            {item.valor > 0 ? "Pagado" : "Pendiente"}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {obtenerMesesPendientes().length > 0 && (
                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">Meses Pendientes de Pago:</h4>
                        <div className="flex flex-wrap gap-2">
                          {obtenerMesesPendientes().map((mes) => (
                            <Badge key={mes.nombre} variant="destructive">
                              {mes.nombre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comprobantes" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mis Comprobantes</CardTitle>
                    <CardDescription>Historial de comprobantes de pago generados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mockComprobantes.length > 0 ? (
                      <div className="space-y-4">
                        {mockComprobantes.map((comprobante) => (
                          <div key={comprobante.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold">Comprobante #{comprobante.numero_comprobante}</h3>
                                  <Badge variant="outline">Pagado</Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                  <div>Fecha: {comprobante.fecha_pago}</div>
                                  <div>Total: ${comprobante.total.toFixed(2)}</div>
                                  <div>Período: {comprobante.meses_vencidos}</div>
                                </div>
                                {comprobante.observaciones && (
                                  <p className="text-sm text-gray-600">{comprobante.observaciones}</p>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Descargar
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay comprobantes disponibles</h3>
                        <p className="text-gray-600">Los comprobantes aparecerán aquí después de realizar pagos</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pagos" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Realizar Pago</CardTitle>
                    <CardDescription>Procese el pago de sus aportes pendientes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {obtenerMesesPendientes().length > 0 ? (
                      <div className="space-y-6">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">Meses Pendientes:</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {obtenerMesesPendientes().map((mes) => (
                              <Badge key={mes.nombre} variant="destructive">
                                {mes.nombre} - $25.00
                              </Badge>
                            ))}
                          </div>
                          <div className="text-lg font-semibold text-blue-800">
                            Total a pagar: ${(obtenerMesesPendientes().length * 25).toFixed(2)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button className="h-20 flex-col">
                            <CreditCard className="h-6 w-6 mb-2" />
                            Pagar con Tarjeta
                          </Button>
                          <Button variant="outline" className="h-20 flex-col bg-transparent">
                            <DollarSign className="h-6 w-6 mb-2" />
                            Transferencia Bancaria
                          </Button>
                        </div>

                        <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-semibold mb-2">Información de Pago:</h5>
                          <ul className="space-y-1">
                            <li>• Aporte mensual: $25.00</li>
                            <li>• Los pagos se procesan en 24-48 horas</li>
                            <li>• Recibirá un comprobante por email</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <DollarSign className="h-12 w-12 text-green-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">¡Está al día con sus pagos!</h3>
                        <p className="text-gray-600">No tiene aportes pendientes en este momento</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
