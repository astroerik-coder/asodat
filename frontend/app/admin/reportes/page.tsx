"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Users,
  DollarSign,
  FileText,
  Search,
  Download,
  LogOut,
  Bell,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { ApiClient, ReporteSocio, ReporteAporte, ReporteComprobante } from "@/lib/api";

export default function ReportesPage() {
  const [activeTab, setActiveTab] = useState("socios");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCampus, setFilterCampus] = useState("all");
  const [filterRol, setFilterRol] = useState("all");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  
  // Estados para socios
  const [socios, setSocios] = useState<ReporteSocio[]>([]);
  const [paginaActualSocios, setPaginaActualSocios] = useState(1);
  const [totalPaginasSocios, setTotalPaginasSocios] = useState(1);
  const [totalSocios, setTotalSocios] = useState(0);
  
  // Estados para aportes
  const [aportes, setAportes] = useState<ReporteAporte[]>([]);
  
  // Estados para comprobantes
  const [comprobantes, setComprobantes] = useState<ReporteComprobante[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    if (activeTab === "socios") {
      cargarReporteSocios();
    } else if (activeTab === "aportes") {
      cargarReporteAportes();
    } else if (activeTab === "comprobantes") {
      cargarReporteComprobantes();
    }
  }, [activeTab, paginaActualSocios, searchTerm, filterCampus, filterRol, fechaInicio, fechaFin]);

  const cargarReporteSocios = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await ApiClient.getReporteSocios({
        buscar: searchTerm || undefined,
        pagina: paginaActualSocios,
        limite: 10,
        campus: filterCampus !== "all" ? filterCampus : undefined,
        rol: filterRol !== "all" ? filterRol : undefined,
      });

      if (response.status === "success" && response.data) {
        setSocios(response.data.socios || []);
        setTotalPaginasSocios(response.data.paginacion?.total_paginas || 1);
        setTotalSocios(response.data.paginacion?.total_registros || 0);
      } else {
        setError(response.error || "Error al cargar reporte de socios");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const cargarReporteAportes = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await ApiClient.getReporteAportes({
        buscar: searchTerm || undefined,
      });

      if (response.status === "success" && response.data) {
        setAportes(response.data.aportes || []);
      } else {
        setError(response.error || "Error al cargar reporte de aportes");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const cargarReporteComprobantes = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await ApiClient.getReporteComprobantes({
        fecha_inicio: fechaInicio || undefined,
        fecha_fin: fechaFin || undefined,
      });

      if (response.status === "success" && response.data) {
        setComprobantes(response.data.comprobantes || []);
      } else {
        setError(response.error || "Error al cargar reporte de comprobantes");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handlePaginaChange = (nuevaPagina: number) => {
    setPaginaActualSocios(nuevaPagina);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (activeTab === "socios") {
      setPaginaActualSocios(1);
    }
  };

  const handleCampusChange = (value: string) => {
    setFilterCampus(value);
    setPaginaActualSocios(1);
  };

  const handleRolChange = (value: string) => {
    setFilterRol(value);
    setPaginaActualSocios(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getTotalAporte = (aporte: ReporteAporte) => {
    return (
      aporte.nuevos_ingresos +
      aporte.dic_24 +
      aporte.ene_25 +
      aporte.feb_25 +
      aporte.mar_25 +
      aporte.abr_25 +
      aporte.may_25 +
      aporte.jun_25 +
      aporte.jul_25 +
      aporte.ago_25 +
      aporte.sept_25 +
      aporte.oct_25 +
      aporte.nov_25 +
      aporte.dic_25
    );
  };

  const exportarReporte = (tipo: string) => {
    // Aquí se implementaría la exportación
    console.log(`Exportando reporte de ${tipo}`);
  };

  return (
    <AuthGuard requiredRole={["tesorero", "secretaria"]}>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin">Administración</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Reportes y Estadísticas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Badge variant="secondary">{user?.rol || "Usuario"}</Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4">
            <div className="mx-auto max-w-7xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Reportes y Estadísticas
                  </h1>
                  <p className="text-muted-foreground">
                    Genere reportes detallados del sistema
                  </p>
                </div>
              </div>

              {/* Tabs de Reportes */}
              <Card>
                <CardHeader>
                  <CardTitle>Seleccione el Tipo de Reporte</CardTitle>
                  <CardDescription>
                    Elija qué tipo de información desea visualizar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-6">
                    <Button
                      variant={activeTab === "socios" ? "default" : "outline"}
                      onClick={() => setActiveTab("socios")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Reporte de Socios
                    </Button>
                    <Button
                      variant={activeTab === "aportes" ? "default" : "outline"}
                      onClick={() => setActiveTab("aportes")}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Reporte de Aportes
                    </Button>
                    <Button
                      variant={activeTab === "comprobantes" ? "default" : "outline"}
                      onClick={() => setActiveTab("comprobantes")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Reporte de Comprobantes
                    </Button>
                  </div>

                  {/* Filtros */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar por nombre o cédula..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {activeTab === "socios" && (
                      <>
                        <Select value={filterCampus} onValueChange={handleCampusChange}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filtrar por campus" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos los campus</SelectItem>
                            <SelectItem value="BELISARIO">Belisario</SelectItem>
                            <SelectItem value="CENTRO">Centro</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={filterRol} onValueChange={handleRolChange}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filtrar por rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos los roles</SelectItem>
                            <SelectItem value="socio">Socio</SelectItem>
                            <SelectItem value="tesorero">Tesorero</SelectItem>
                            <SelectItem value="secretaria">Secretaria</SelectItem>
                            <SelectItem value="presidente">Presidente</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )}

                    {activeTab === "comprobantes" && (
                      <>
                        <Input
                          type="date"
                          placeholder="Fecha inicio"
                          value={fechaInicio}
                          onChange={(e) => setFechaInicio(e.target.value)}
                          className="w-48"
                        />
                        <Input
                          type="date"
                          placeholder="Fecha fin"
                          value={fechaFin}
                          onChange={(e) => setFechaFin(e.target.value)}
                          className="w-48"
                        />
                      </>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => {
                        if (activeTab === "socios") cargarReporteSocios();
                        else if (activeTab === "aportes") cargarReporteAportes();
                        else if (activeTab === "comprobantes") cargarReporteComprobantes();
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? "Cargando..." : "Aplicar Filtros"}
                    </Button>
                  </div>

                  {/* Contenido de los Tabs */}
                  {activeTab === "socios" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          Reporte de Socios ({totalSocios} total)
                        </h3>
                        <Button
                          variant="outline"
                          onClick={() => exportarReporte("socios")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </Button>
                      </div>

                      {isLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Cargando socios...</p>
                        </div>
                      ) : error ? (
                        <div className="text-center py-8">
                          <div className="text-red-500 mb-4">
                            <p className="font-semibold">Error al cargar socios</p>
                            <p className="text-sm">{error}</p>
                          </div>
                        </div>
                      ) : socios.length > 0 ? (
                        <>
                          <div className="grid gap-4">
                            {socios.map((socio) => (
                              <div
                                key={socio.cedula}
                                className="border rounded-lg p-4 hover:bg-gray-50"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <h4 className="font-semibold">
                                        {socio.nombre || "Sin nombre"}
                                      </h4>
                                      <Badge variant="secondary">
                                        {socio.cedula}
                                      </Badge>
                                      <Badge variant="outline">
                                        {socio.rol || "Sin rol"}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                                      <div>
                                        <strong>Campus:</strong> {socio.campus || "No especificado"}
                                      </div>
                                      <div>
                                        <strong>Tipo Usuario:</strong> {socio.tipo_usuario || "No especificado"}
                                      </div>
                                      <div>
                                        <strong>Fecha Afiliación:</strong>{" "}
                                        {socio.fecha_afiliacion
                                          ? formatDate(socio.fecha_afiliacion)
                                          : "No especificada"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Paginación para Socios */}
                          {totalPaginasSocios > 1 && (
                            <div className="flex items-center justify-between mt-6">
                              <div className="text-sm text-gray-600">
                                Mostrando {((paginaActualSocios - 1) * 10) + 1} a{" "}
                                {Math.min(paginaActualSocios * 10, totalSocios)} de {totalSocios} socios
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePaginaChange(paginaActualSocios - 1)}
                                  disabled={paginaActualSocios === 1}
                                >
                                  Anterior
                                </Button>

                                <div className="flex items-center space-x-1">
                                  {Array.from(
                                    { length: Math.min(5, totalPaginasSocios) },
                                    (_, i) => {
                                      let pagina = i + 1;
                                      if (totalPaginasSocios > 5) {
                                        if (paginaActualSocios <= 3) {
                                          pagina = i + 1;
                                        } else if (paginaActualSocios >= totalPaginasSocios - 2) {
                                          pagina = totalPaginasSocios - 4 + i;
                                        } else {
                                          pagina = paginaActualSocios - 2 + i;
                                        }
                                      }

                                      return (
                                        <Button
                                          key={pagina}
                                          variant={
                                            paginaActualSocios === pagina ? "default" : "outline"
                                          }
                                          size="sm"
                                          onClick={() => handlePaginaChange(pagina)}
                                          className="w-8 h-8 p-0"
                                        >
                                          {pagina}
                                        </Button>
                                      );
                                    }
                                  )}
                                </div>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePaginaChange(paginaActualSocios + 1)}
                                  disabled={paginaActualSocios === totalPaginasSocios}
                                >
                                  Siguiente
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No se encontraron socios
                          </h3>
                          <p className="text-gray-600">
                            Intente ajustar los filtros de búsqueda
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "aportes" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          Reporte de Aportes ({aportes.length} registros)
                        </h3>
                        <Button
                          variant="outline"
                          onClick={() => exportarReporte("aportes")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </Button>
                      </div>

                      {isLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Cargando aportes...</p>
                        </div>
                      ) : error ? (
                        <div className="text-center py-8">
                          <div className="text-red-500 mb-4">
                            <p className="font-semibold">Error al cargar aportes</p>
                            <p className="text-sm">{error}</p>
                          </div>
                        </div>
                      ) : aportes.length > 0 ? (
                        <div className="grid gap-4">
                          {aportes.map((aporte) => (
                            <div
                              key={aporte.cedula}
                              className="border rounded-lg p-4 hover:bg-gray-50"
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-semibold">
                                      {aporte.nombre || "Sin nombre"}
                                    </h4>
                                    <Badge variant="secondary">
                                      {aporte.cedula}
                                    </Badge>
                                    <Badge variant="outline">
                                      Total: {formatCurrency(getTotalAporte(aporte))}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                                    <div>
                                      <strong>Nuevos Ingresos:</strong> {formatCurrency(aporte.nuevos_ingresos)}
                                    </div>
                                    <div>
                                      <strong>Dic 24:</strong> {formatCurrency(aporte.dic_24)}
                                    </div>
                                    <div>
                                      <strong>Ene 25:</strong> {formatCurrency(aporte.ene_25)}
                                    </div>
                                    <div>
                                      <strong>Feb 25:</strong> {formatCurrency(aporte.feb_25)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No se encontraron aportes
                          </h3>
                          <p className="text-gray-600">
                            Intente ajustar los filtros de búsqueda
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "comprobantes" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          Reporte de Comprobantes ({comprobantes.length} registros)
                        </h3>
                        <Button
                          variant="outline"
                          onClick={() => exportarReporte("comprobantes")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </Button>
                      </div>

                      {isLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Cargando comprobantes...</p>
                        </div>
                      ) : error ? (
                        <div className="text-center py-8">
                          <div className="text-red-500 mb-4">
                            <p className="font-semibold">Error al cargar comprobantes</p>
                            <p className="text-sm">{error}</p>
                          </div>
                        </div>
                      ) : comprobantes.length > 0 ? (
                        <div className="grid gap-4">
                          {comprobantes.map((comprobante) => (
                            <div
                              key={comprobante.id}
                              className="border rounded-lg p-4 hover:bg-gray-50"
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-semibold">
                                      Comprobante #{comprobante.numero_comprobante}
                                    </h4>
                                    <Badge variant="secondary">
                                      {comprobante.cedula}
                                    </Badge>
                                    <Badge variant="outline">
                                      {formatCurrency(comprobante.total)}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                                    <div>
                                      <strong>Fecha Pago:</strong> {formatDate(comprobante.fecha_pago)}
                                    </div>
                                    <div>
                                      <strong>Total:</strong> {formatCurrency(comprobante.total)}
                                    </div>
                                    <div>
                                      <strong>Ingreso:</strong> {formatCurrency(comprobante.ingreso)}
                                    </div>
                                    <div>
                                      <strong>Observaciones:</strong> {comprobante.observaciones || "Ninguna"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No se encontraron comprobantes
                          </h3>
                          <p className="text-gray-600">
                            Intente ajustar los filtros de búsqueda
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
