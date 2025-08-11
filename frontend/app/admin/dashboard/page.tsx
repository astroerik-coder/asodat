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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  Plus,
  Search,
  Download,
  LogOut,
  Bell,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { ApiClient, Socio } from "@/lib/api";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCampus, setFilterCampus] = useState("all");
  const [socios, setSocios] = useState<Socio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalSocios, setTotalSocios] = useState(0);
  const [limitePorPagina] = useState(10);
  const { user, logout } = useAuth();

  useEffect(() => {
    cargarSocios();
  }, [paginaActual, searchTerm, filterCampus]);

  const cargarSocios = async () => {
    try {
      setIsLoading(true);
      setError("");

      const skip = (paginaActual - 1) * limitePorPagina;
      const response = await ApiClient.getSocios({
        buscar: searchTerm || undefined,
        pagina: paginaActual,
        limite: limitePorPagina,
      });

      if (response.status === "success" && response.data) {
        setSocios(response.data.socios || []);
        setTotalPaginas(response.data.paginacion?.total_paginas || 1);
        setTotalSocios(response.data.paginacion?.total_socios || 0);
        console.log("Socios cargados:", response.data.socios);
      } else {
        setError(response.error || "Error al cargar socios");
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
    setPaginaActual(nuevaPagina);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPaginaActual(1); // Resetear a la primera página al buscar
  };

  const handleCampusChange = (value: string) => {
    setFilterCampus(value);
    setPaginaActual(1);
  };

  return (
    <AuthGuard
      requiredRole={["admin", "tesorero", "secretaria", "presidente", "socio"]}
    >
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
                    <BreadcrumbLink href="/admin">
                      Administración
                    </BreadcrumbLink>
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
              <Badge variant="secondary">{user?.rol || "Usuario"}</Badge>
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
                  <CardTitle className="text-sm font-medium">
                    Total Socios
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSocios}</div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading
                      ? "Cargando..."
                      : `${socios.length} mostrados de ${totalSocios}`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Aportes del Mes
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,250.00</div>
                  <p className="text-xs text-muted-foreground">
                    +15% desde el mes pasado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Comprobantes
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">
                    Generados este mes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Morosidad
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5%</div>
                  <p className="text-xs text-muted-foreground">
                    -2% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
              <Tabs defaultValue="socios" className="p-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="socios">Gestión de Socios</TabsTrigger>
                </TabsList>

                <TabsContent value="socios" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Gestión de Socios</CardTitle>
                          <CardDescription>
                            Administre la información de los socios registrados
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={cargarSocios}
                            disabled={isLoading}
                          >
                            {isLoading ? "Cargando..." : "Recargar"}
                          </Button>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Socio
                          </Button>
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
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {/* Lista de Socios */}
                      <div className="space-y-4">
                        {isLoading ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Cargando socios...</p>
                          </div>
                        ) : error ? (
                          <div className="text-center py-8">
                            <div className="text-red-500 mb-4">
                              <p className="font-semibold">
                                Error al cargar socios
                              </p>
                              <p className="text-sm">{error}</p>
                            </div>
                            <Button variant="outline" onClick={cargarSocios}>
                              Reintentar
                            </Button>
                          </div>
                        ) : socios.length > 0 ? (
                          <>
                            {socios.map((socio) => (
                              <div
                                key={socio.cedula}
                                className="border rounded-lg p-4 hover:bg-gray-50"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <h3 className="font-semibold">
                                        {socio.apellidos_nombres ||
                                          "Sin nombre"}
                                      </h3>
                                      <Badge
                                        variant={
                                          socio.tipo_usuario === "fundador"
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {socio.tipo_usuario || "socio"}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                      <div>Cédula: {socio.cedula}</div>
                                      <div>
                                        Campus:{" "}
                                        {socio.campus || "No especificado"}
                                      </div>
                                      <div>
                                        Cargo:{" "}
                                        {socio.cargo || "No especificado"}
                                      </div>
                                      <div>
                                        Celular:{" "}
                                        {socio.celular || "No especificado"}
                                      </div>
                                      <div>
                                        Email:{" "}
                                        {socio.correo || "No especificado"}
                                      </div>
                                      <div>
                                        Afiliación:{" "}
                                        {socio.fecha_afiliacion ||
                                          "No especificado"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                      Editar
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      Ver Aportes
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {searchTerm || filterCampus !== "all"
                                ? "No se encontraron socios"
                                : "No hay socios registrados"}
                            </h3>
                            <p className="text-gray-600">
                              {searchTerm || filterCampus !== "all"
                                ? "Intente ajustar los filtros de búsqueda"
                                : "Comience agregando el primer socio al sistema"}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Controles de Paginación */}
                      {!isLoading && !error && totalPaginas > 1 && (
                        <div className="flex items-center justify-between mt-6">
                          <div className="text-sm text-gray-600">
                            Mostrando {(paginaActual - 1) * limitePorPagina + 1}{" "}
                            a{" "}
                            {Math.min(
                              paginaActual * limitePorPagina,
                              totalSocios
                            )}{" "}
                            de {totalSocios} socios
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handlePaginaChange(paginaActual - 1)
                              }
                              disabled={paginaActual === 1}
                            >
                              Anterior
                            </Button>

                            <div className="flex items-center space-x-1">
                              {Array.from(
                                { length: Math.min(5, totalPaginas) },
                                (_, i) => {
                                  let pagina = i + 1;
                                  if (totalPaginas > 5) {
                                    if (paginaActual <= 3) {
                                      pagina = i + 1;
                                    } else if (
                                      paginaActual >=
                                      totalPaginas - 2
                                    ) {
                                      pagina = totalPaginas - 4 + i;
                                    } else {
                                      pagina = paginaActual - 2 + i;
                                    }
                                  }

                                  return (
                                    <Button
                                      key={pagina}
                                      variant={
                                        paginaActual === pagina
                                          ? "default"
                                          : "outline"
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
                              onClick={() =>
                                handlePaginaChange(paginaActual + 1)
                              }
                              disabled={paginaActual === totalPaginas}
                            >
                              Siguiente
                            </Button>
                          </div>
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
    </AuthGuard>
  );
}
