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
import { Badge } from "@/components/ui/badge";
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
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  LogOut,
  Bell,
  User,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { ApiClient, MisAportes } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function MisAportesPage() {
  const [misAportes, setMisAportes] = useState<MisAportes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    cargarMisAportes();
  }, []);

  const cargarMisAportes = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await ApiClient.getMisAportes();

      if (response.status === "success" && response.data) {
        setMisAportes(response.data);
      } else {
        setError(response.error || "Error al cargar aportes");
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
      dic_24: "Diciembre 2024",
      ene_25: "Enero 2025",
      feb_25: "Febrero 2025",
      mar_25: "Marzo 2025",
      abr_25: "Abril 2025",
      may_25: "Mayo 2025",
      jun_25: "Junio 2025",
      jul_25: "Julio 2025",
      ago_25: "Agosto 2025",
      sept_25: "Septiembre 2025",
      oct_25: "Octubre 2025",
      nov_25: "Noviembre 2025",
      dic_25: "Diciembre 2025",
    };
    return meses[mes] || mes;
  };

  const getMesCorto = (mes: string) => {
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
                    <BreadcrumbPage>Mis Aportes</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <main className="flex-1 overflow-auto p-4">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando aportes...</p>
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
                  <BreadcrumbPage>Mis Aportes</BreadcrumbPage>
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
            <div className="mx-auto max-w-6xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Mis Aportes
                  </h1>
                  <p className="text-muted-foreground">
                    Historial y estado de mis contribuciones mensuales
                  </p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <User className="h-4 w-4 mr-2" />
                  {user?.cedula || "Usuario"}
                </Badge>
              </div>

              {error ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <div className="text-red-500 mb-4">
                        <p className="font-semibold">Error al cargar aportes</p>
                        <p className="text-sm">{error}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : misAportes ? (
                <>
                  {/* Resumen de Aportes */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Recaudado
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatCurrency(misAportes.total)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Total de todos los aportes
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Meses Pagados
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Object.values(misAportes.meses).filter(
                            (estado) => estado === "Pagado"
                          ).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          De 13 meses disponibles
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Promedio Mensual
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatCurrency(
                            misAportes.total /
                              Math.max(
                                Object.values(misAportes.meses).filter(
                                  (estado) => estado === "Pagado"
                                ).length,
                                1
                              )
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Promedio por mes pagado
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Grilla de Meses */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Estado de Aportes por Mes
                      </CardTitle>
                      <CardDescription>
                        Visualice el estado de cada mes y el monto pagado
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Object.entries(misAportes.meses).map(([mes, estado]) => (
                          <div
                            key={mes}
                            className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
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
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {getMesCorto(mes)}
                            </div>
                            <div className="text-xs text-gray-600">
                              {misAportes.valores[mes as keyof typeof misAportes.valores]
                                ? formatCurrency(
                                    misAportes.valores[
                                      mes as keyof typeof misAportes.valores
                                    ] || 0
                                  )
                                : "$0.00"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detalle Mensual */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Detalle Mensual de Aportes
                      </CardTitle>
                      <CardDescription>
                        Información detallada de cada mes con montos y estados
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 font-medium">
                                Mes
                              </th>
                              <th className="text-left py-3 px-4 font-medium">
                                Estado
                              </th>
                              <th className="text-left py-3 px-4 font-medium">
                                Monto
                              </th>
                              <th className="text-left py-3 px-4 font-medium">
                                Fecha de Pago
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(misAportes.meses).map(
                              ([mes, estado]) => {
                                const monto =
                                  misAportes.valores[
                                    mes as keyof typeof misAportes.valores
                                  ] || 0;
                                return (
                                  <tr
                                    key={mes}
                                    className="border-b hover:bg-gray-50"
                                  >
                                    <td className="py-3 px-4">
                                      <div className="font-medium">
                                        {getMesLabel(mes)}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <Badge
                                        variant={getEstadoBadgeVariant(estado)}
                                        className="flex items-center gap-1 w-fit"
                                      >
                                        {getEstadoIcon(estado)}
                                        {estado}
                                      </Badge>
                                    </td>
                                    <td className="py-3 px-4">
                                      <span
                                        className={
                                          monto > 0
                                            ? "text-green-600 font-medium"
                                            : "text-gray-500"
                                        }
                                      >
                                        {formatCurrency(monto)}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                      {monto > 0
                                        ? "Registrado"
                                        : "Pendiente"}
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información Adicional */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Información Importante</CardTitle>
                      <CardDescription>
                        Notas sobre el sistema de aportes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p>
                            Los aportes se registran mensualmente y se reflejan en
                            tiempo real en el sistema.
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p>
                            El estado "Pagado" indica que el aporte del mes ha
                            sido registrado y procesado.
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p>
                            Para consultas sobre aportes o pagos, contacte a la
                            secretaría o tesorero de ASODAT.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No se encontraron aportes
                      </h3>
                      <p className="text-gray-600">
                        No se pudieron cargar los datos de aportes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
