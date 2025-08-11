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
  Plus,
  Search,
  Trash2,
  Calendar,
  UserX,
  LogOut,
  Bell,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { ApiClient, Eliminacion } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EliminacionesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [eliminaciones, setEliminaciones] = useState<Eliminacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalEliminaciones, setTotalEliminaciones] = useState(0);
  const [limitePorPagina] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nuevaEliminacion, setNuevaEliminacion] = useState({
    cedula: "",
    motivo: "",
  });
  const { user, logout } = useAuth();

  useEffect(() => {
    cargarEliminaciones();
  }, [paginaActual, searchTerm]);

  const cargarEliminaciones = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await ApiClient.getEliminaciones({
        buscar: searchTerm || undefined,
        pagina: paginaActual,
        limite: limitePorPagina,
      });

      if (response.status === "success" && response.data) {
        setEliminaciones(response.data.eliminaciones || []);
        setTotalPaginas(response.data.paginacion?.total_paginas || 1);
        setTotalEliminaciones(response.data.paginacion?.total_eliminaciones || 0);
      } else {
        setError(response.error || "Error al cargar eliminaciones");
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
    setPaginaActual(1);
  };

  const handleCrearEliminacion = async () => {
    try {
      if (!nuevaEliminacion.cedula || !nuevaEliminacion.motivo) {
        setError("Todos los campos son obligatorios");
        return;
      }

      const response = await ApiClient.crearEliminacion(nuevaEliminacion);
      
      if (response.status === "success") {
        setIsDialogOpen(false);
        setNuevaEliminacion({ cedula: "", motivo: "" });
        cargarEliminaciones();
      } else {
        setError(response.error || "Error al crear eliminación");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
                  <BreadcrumbLink href="/admin">
                    Administración
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Eliminaciones</BreadcrumbPage>
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
                    Gestión de Eliminaciones
                  </h1>
                  <p className="text-muted-foreground">
                    Administre el historial de socios eliminados del sistema
                  </p>
                </div>
               {/*  <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Eliminación
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Eliminación de Socio</DialogTitle>
                      <DialogDescription>
                        Ingrese los datos del socio a eliminar del sistema
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cedula">Cédula del Socio</Label>
                        <Input
                          id="cedula"
                          placeholder="Ej: 0502399397"
                          value={nuevaEliminacion.cedula}
                          onChange={(e) =>
                            setNuevaEliminacion({
                              ...nuevaEliminacion,
                              cedula: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="motivo">Motivo de Eliminación</Label>
                        <Textarea
                          id="motivo"
                          placeholder="Describa el motivo de la eliminación..."
                          value={nuevaEliminacion.motivo}
                          onChange={(e) =>
                            setNuevaEliminacion({
                              ...nuevaEliminacion,
                              motivo: e.target.value,
                            })
                          }
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleCrearEliminacion}>
                        Registrar Eliminación
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog> */}
              </div>

              {/* Estadísticas */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Eliminaciones
                    </CardTitle>
                    <UserX className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalEliminaciones}</div>
                    <p className="text-xs text-muted-foreground">
                      {isLoading
                        ? "Cargando..."
                        : `${eliminaciones.length} mostradas de ${totalEliminaciones}`}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de Eliminaciones */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Historial de Eliminaciones</CardTitle>
                      <CardDescription>
                        Registro de todos los socios eliminados del sistema
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={cargarEliminaciones}
                        disabled={isLoading}
                      >
                        {isLoading ? "Cargando..." : "Recargar"}
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

                  {/* Lista */}
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando eliminaciones...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-8">
                        <div className="text-red-500 mb-4">
                          <p className="font-semibold">
                            Error al cargar eliminaciones
                          </p>
                          <p className="text-sm">{error}</p>
                        </div>
                        <Button variant="outline" onClick={cargarEliminaciones}>
                          Reintentar
                        </Button>
                      </div>
                    ) : eliminaciones.length > 0 ? (
                      <>
                        {eliminaciones.map((eliminacion) => (
                          <div
                            key={eliminacion.id}
                            className="border rounded-lg p-4 hover:bg-gray-50"
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold">
                                    {eliminacion.nombre_completo}
                                  </h3>
                                  <Badge variant="destructive">
                                    Eliminado
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                  <div>Cédula: {eliminacion.cedula}</div>
                                  <div>
                                    Fecha Afiliación:{" "}
                                    {eliminacion.fecha_afiliacion
                                      ? formatDate(eliminacion.fecha_afiliacion)
                                      : "No especificada"}
                                  </div>
                                  <div>
                                    Fecha Eliminación:{" "}
                                    {formatDateTime(eliminacion.fecha_eliminacion)}
                                  </div>
                                  <div className="md:col-span-3">
                                    <strong>Motivo:</strong> {eliminacion.motivo}
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Ver Detalles
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {searchTerm
                            ? "No se encontraron eliminaciones"
                            : "No hay eliminaciones registradas"}
                        </h3>
                        <p className="text-gray-600">
                          {searchTerm
                            ? "Intente ajustar los términos de búsqueda"
                            : "Los registros de eliminación aparecerán aquí"}
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
                          totalEliminaciones
                        )}{" "}
                        de {totalEliminaciones} eliminaciones
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
                                  paginaActual >= totalPaginas - 2
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
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
