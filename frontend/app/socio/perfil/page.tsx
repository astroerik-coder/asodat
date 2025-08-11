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
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Crown,
  LogOut,
  Bell,
  Edit,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { ApiClient, DatosPersonales } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function MiPerfilPage() {
  const [datosPersonales, setDatosPersonales] = useState<DatosPersonales | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    cargarMisDatos();
  }, []);

  const cargarMisDatos = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await ApiClient.getMisDatos();

      if (response.status === "success" && response.data) {
        setDatosPersonales(response.data);
      } else {
        setError(response.error || "Error al cargar datos personales");
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        return "No especificado";
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
                    <BreadcrumbPage>Mi Perfil</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <main className="flex-1 overflow-auto p-4">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando perfil...</p>
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
                  <BreadcrumbPage>Mi Perfil</BreadcrumbPage>
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
            <div className="mx-auto max-w-4xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Mi Perfil
                  </h1>
                  <p className="text-muted-foreground">
                    Información personal y datos de afiliación
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
                        <p className="font-semibold">Error al cargar perfil</p>
                        <p className="text-sm">{error}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : datosPersonales ? (
                <>
                  {/* Información Personal */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Información Personal
                      </CardTitle>
                      <CardDescription>
                        Datos básicos de identificación
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Cédula de Identidad
                          </Label>
                          <p className="font-mono text-lg">{datosPersonales.cedula}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Nombre Completo
                          </Label>
                          <p className="text-lg font-medium">
                            {datosPersonales.nombrecompleto}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Género
                          </Label>
                          <p className="text-lg">
                            {getGeneroLabel(datosPersonales.genero || "")}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Fecha de Afiliación
                          </Label>
                          <p className="text-lg">
                            {formatDate(datosPersonales.fecha_afiliacion || "")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información Institucional */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Información Institucional
                      </CardTitle>
                      <CardDescription>
                        Datos relacionados con la afiliación
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Campus
                          </Label>
                          <p className="text-lg">
                            {getCampusLabel(datosPersonales.campus || "")}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Régimen
                          </Label>
                          <p className="text-lg">
                            {getRegimenLabel(datosPersonales.regimen || "")}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Cargo
                          </Label>
                          <p className="text-lg">
                            {datosPersonales.cargo || "Sin cargo asignado"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información de Contacto */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Información de Contacto
                      </CardTitle>
                      <CardDescription>
                        Datos para comunicarse con usted
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Correo Electrónico
                          </Label>
                          <p className="text-lg">
                            {datosPersonales.correo || "No especificado"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Celular
                          </Label>
                          <p className="text-lg">
                            {datosPersonales.celular || "No especificado"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Dirección
                        </Label>
                        <p className="text-lg">
                          {datosPersonales.direccion || "No especificada"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No se encontraron datos
                      </h3>
                      <p className="text-gray-600">
                        No se pudieron cargar los datos personales
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
