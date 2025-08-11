"use client";

import { useState, useEffect } from "react";
import { SocioSidebar } from "@/components/socio-sidebar";
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
  User,
  DollarSign,
  FileText,
  Calendar,
  LogOut,
  Bell,
  CheckCircle,
  XCircle,
  TrendingUp,
  MapPin,
  Building,
  Crown,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { ApiClient, DatosPersonales, MisAportes } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SocioDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [datosPersonales, setDatosPersonales] = useState<DatosPersonales | null>(null);
  const [misAportes, setMisAportes] = useState<MisAportes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Cargar datos personales y aportes en paralelo
      const [datosResponse, aportesResponse] = await Promise.all([
        ApiClient.getMisDatos(),
        ApiClient.getMisAportes(),
      ]);

      if (datosResponse.status === "success" && datosResponse.data) {
        setDatosPersonales(datosResponse.data);
      }

      if (aportesResponse.status === "success" && aportesResponse.data) {
        setMisAportes(aportesResponse.data);
      }

      if (datosResponse.status === "error" && aportesResponse.status === "error") {
        setError("Error al cargar datos");
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getMesLabel = (mes: string) => {
    const meses: { [key: string]: string } = {
      dic_24: "Dic 24",
      ene_25: "Ene 25",
      feb_25: "Feb 25",
      mar_25: "Mar 25",
      abr_25: "Abr 25",
      may_25: "May 25",
      jun_25: "Jun 25",
      jul_25: "Jul 25",
      ago_25: "Ago 25",
      sept_25: "Sep 25",
      oct_25: "Oct 25",
      nov_25: "Nov 25",
      dic_25: "Dic 25",
    };
    return meses[mes] || mes;
  };

  const getEstadoBadgeVariant = (estado: string) => {
    return estado === "Pagado" ? "default" : "secondary";
  };

  const getEstadoIcon = (estado: string) => {
    return estado === "Pagado" ? (
      <CheckCircle className="h-4 w-4" />
    ) : (
      <XCircle className="h-4 w-4" />
    );
  };

  const getRolLabel = (rol: string) => {
    switch (rol) {
      case "presidente":
        return "Presidente";
      case "tesorero":
        return "Tesorero";
      case "secretaria":
        return "Secretaria";
      case "socio":
        return "Socio";
      default:
        return "Usuario";
    }
  };

  const getRolBadgeVariant = (rol: string) => {
    switch (rol) {
      case "presidente":
        return "default";
      case "tesorero":
        return "secondary";
      case "secretaria":
        return "outline";
      case "socio":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getCampusLabel = (campus: string) => {
    switch (campus) {
      case "BELISARIO":
        return "Belisario";
      case "CENTRO":
        return "Centro";
      default:
        return "No especificado";
    }
  };

  const getGeneroLabel = (genero: string) => {
    switch (genero) {
      case "M":
        return "Masculino";
      case "F":
        return "Femenino";
      default:
        return "No especificado";
    }
  };

  const getRegimenLabel = (regimen: string) => {
    switch (regimen) {
      case "ADHERENTE":
        return "Adherente";
      case "AFILIADO":
        return "Afiliado";
      default:
        return "No especificado";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const navegarAPerfil = () => {
    router.push("/socio/perfil");
  };

  const navegarAAportes = () => {
    router.push("/socio/aportes");
  };

  if (isLoading) {
    return (
      <AuthGuard requiredRole={["socio", "tesorero", "secretaria", "presidente"]}>
        <SidebarProvider>
          <SocioSidebar />
          <SidebarInset className="flex flex-col">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
            </header>
            <main className="flex-1 overflow-auto p-4">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando dashboard...</p>
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRole={["socio", "tesorero", "secretaria", "presidente"]}>
      <SidebarProvider>
        <SocioSidebar />
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Badge variant={getRolBadgeVariant(user?.rol || "")}>
                {getRolLabel(user?.rol || "")}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4">
            <div className="mx-auto max-w-7xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Mi Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Bienvenido, {datosPersonales?.nombrecompleto || user?.cedula}
                  </p>
                </div>
                <Badge variant={getRolBadgeVariant(user?.rol || "")}>
                  {getRolLabel(user?.rol || "")}
                </Badge>
              </div>

              {error ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <div className="text-red-500 mb-4">
                        <p className="font-semibold">Error al cargar datos</p>
                        <p className="text-sm">{error}</p>
                      </div>
                      <Button onClick={cargarDatos} variant="outline">
                        Reintentar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estado de Cuenta</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">Activo</div>
                        <p className="text-xs text-muted-foreground">
                          {datosPersonales?.regimen ? getRegimenLabel(datosPersonales.regimen) : "Socio activo"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Aportes</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {misAportes ? formatCurrency(misAportes.total) : "$0.00"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Total acumulado
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Meses Pagados</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {misAportes ? 
                            Object.values(misAportes.meses).filter(estado => estado === "Pagado").length : 0
                          }
                        </div>
                        <p className="text-xs text-muted-foreground">
                          De 13 meses disponibles
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Campus</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {datosPersonales?.campus ? getCampusLabel(datosPersonales.campus) : "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Campus asignado
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Main Content */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Información Personal</CardTitle>
                      <CardDescription>
                        Resumen de tus datos y estado de cuenta
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="resumen" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="resumen">Resumen</TabsTrigger>
                          <TabsTrigger value="aportes">Mis Aportes</TabsTrigger>
                          <TabsTrigger value="detalles">Detalles</TabsTrigger>
                        </TabsList>

                        <TabsContent value="resumen" className="space-y-6 mt-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">Datos Personales</h3>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Cédula:</span>
                                  <span className="font-medium">{datosPersonales?.cedula || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Nombre:</span>
                                  <span className="font-medium">{datosPersonales?.nombrecompleto || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Género:</span>
                                  <span className="font-medium">
                                    {datosPersonales?.genero ? getGeneroLabel(datosPersonales.genero) : "N/A"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Cargo:</span>
                                  <span className="font-medium">{datosPersonales?.cargo || "Sin cargo"}</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">Información de Contacto</h3>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Correo:</span>
                                  <span className="font-medium">{datosPersonales?.correo || "No especificado"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Celular:</span>
                                  <span className="font-medium">{datosPersonales?.celular || "No especificado"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Dirección:</span>
                                  <span className="font-medium">{datosPersonales?.direccion || "No especificada"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={navegarAPerfil} variant="outline">
                              Ver Perfil Completo
                            </Button>
                            <Button onClick={navegarAAportes} variant="outline">
                              Ver Aportes Detallados
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="aportes" className="space-y-6 mt-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Estado de Aportes por Mes</h3>
                            {misAportes ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {Object.entries(misAportes.meses).map(([mes, estado]) => (
                                  <div
                                    key={mes}
                                    className="text-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="mb-2">
                                      <Badge
                                        variant={getEstadoBadgeVariant(estado)}
                                        className="flex items-center gap-1 mx-auto"
                                      >
                                        {getEstadoIcon(estado)}
                                        {estado}
                                      </Badge>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {getMesLabel(mes)}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {misAportes.valores[mes as keyof typeof misAportes.valores]
                                        ? formatCurrency(misAportes.valores[mes as keyof typeof misAportes.valores] || 0)
                                        : "$0.00"}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No hay datos de aportes disponibles</p>
                              </div>
                            )}
                            <div className="flex justify-center">
                              <Button onClick={navegarAAportes} variant="outline">
                                Ver Aportes Completos
                              </Button>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="detalles" className="space-y-6 mt-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Información Institucional</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Campus:</span>
                                  <span className="font-medium">
                                    {datosPersonales?.campus ? getCampusLabel(datosPersonales.campus) : "N/A"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Régimen:</span>
                                  <span className="font-medium">
                                    {datosPersonales?.regimen ? getRegimenLabel(datosPersonales.regimen) : "N/A"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Fecha Afiliación:</span>
                                  <span className="font-medium">
                                    {datosPersonales?.fecha_afiliacion ? formatDate(datosPersonales.fecha_afiliacion) : "N/A"}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Rol en Sistema:</span>
                                  <Badge variant={getRolBadgeVariant(user?.rol || "")}>
                                    {getRolLabel(user?.rol || "")}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Estado:</span>
                                  <span className="font-medium text-green-600">Activo</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
