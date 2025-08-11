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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Bell,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Crown,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { ApiClient, Socio } from "@/lib/api";

interface FormData {
  cedula: string;
  apellidos_nombres: string;
  campus: string;
  genero: string;
  regimen: string;
  celular: string;
  rol: string;
  cargo: string;
  direccion: string;
  fecha_afiliacion: string;
  observaciones: string;
  correo: string;
  tipo_usuario: string;
}

export default function SociosPage() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCampus, setFilterCampus] = useState("all");
  const [filterRol, setFilterRol] = useState("all");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalSocios, setTotalSocios] = useState(0);
  const [limitePorPagina] = useState(10);

  // Estados para el modal
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSocio, setSelectedSocio] = useState<Socio | null>(null);
  const [formData, setFormData] = useState<FormData>({
    cedula: "",
    apellidos_nombres: "",
    campus: "BELISARIO",
    genero: "M",
    regimen: "ADHERENTE",
    celular: "",
    rol: "socio",
    cargo: "",
    direccion: "",
    fecha_afiliacion: "",
    observaciones: "",
    correo: "",
    tipo_usuario: "ADHERENTE",
  });

  const { user, logout } = useAuth();

  useEffect(() => {
    cargarSocios();
  }, [paginaActual, searchTerm, filterCampus, filterRol]);

  const cargarSocios = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await ApiClient.getSocios({
        buscar: searchTerm || undefined,
        pagina: paginaActual,
        limite: limitePorPagina,
        campus: filterCampus !== "all" ? filterCampus : undefined,
        rol: filterRol !== "all" ? filterRol : undefined,
      });

      if (response.status === "success" && response.data) {
        setSocios(response.data.socios || []);
        setTotalPaginas(response.data.paginacion?.total_paginas || 1);
        setTotalSocios(response.data.paginacion?.total_socios || 0);
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
    setPaginaActual(1);
  };

  const handleCampusChange = (value: string) => {
    setFilterCampus(value);
    setPaginaActual(1);
  };

  const handleRolChange = (value: string) => {
    setFilterRol(value);
    setPaginaActual(1);
  };

  const openCreateDialog = () => {
    setIsEditMode(false);
    setSelectedSocio(null);
    setFormData({
      cedula: "",
      apellidos_nombres: "",
      campus: "BELISARIO",
      genero: "M",
      regimen: "ADHERENTE",
      celular: "",
      rol: "socio",
      cargo: "",
      direccion: "",
      fecha_afiliacion: "",
      observaciones: "",
      correo: "",
      tipo_usuario: "ADHERENTE",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (socio: Socio) => {
    setIsEditMode(true);
    setSelectedSocio(socio);
    setFormData({
      cedula: socio.cedula,
      apellidos_nombres: socio.apellidos_nombres || "",
      campus: socio.campus || "BELISARIO",
      genero: socio.genero || "M",
      regimen: socio.regimen || "ADHERENTE",
      celular: socio.celular || "",
      rol: socio.rol || "socio",
      cargo: socio.cargo || "",
      direccion: socio.direccion || "",
      fecha_afiliacion: socio.fecha_afiliacion || "",
      observaciones: socio.observaciones || "",
      correo: socio.correo || "",
      tipo_usuario: socio.tipo_usuario || "ADHERENTE",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        // TODO: Implementar actualización de socio
        console.log("Actualizando socio:", formData);
      } else {
        // TODO: Implementar creación de socio
        console.log("Creando socio:", formData);
      }
      setDialogOpen(false);
      cargarSocios();
    } catch (error) {
      console.error("Error al guardar socio:", error);
    }
  };

  const handleDelete = async (cedula: string) => {
    if (confirm("¿Está seguro de que desea eliminar este socio?")) {
      try {
        // TODO: Implementar eliminación de socio
        console.log("Eliminando socio:", cedula);
        cargarSocios();
      } catch (error) {
        console.error("Error al eliminar socio:", error);
      }
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

  const getCampusBadgeVariant = (campus: string) => {
    switch (campus) {
      case "BELISARIO":
        return "default";
      case "CENTRO":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <AuthGuard requiredRole={["tesorero", "secretaria", "presidente"]}>
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
                  <BreadcrumbPage>Gestión de Socios</BreadcrumbPage>
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
                    Gestión de Socios
                  </h1>
                  <p className="text-muted-foreground">
                    Administre la información de todos los socios del sistema
                  </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openCreateDialog}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Socio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {isEditMode ? "Editar Socio" : "Nuevo Socio"}
                      </DialogTitle>
                      <DialogDescription>
                        {isEditMode
                          ? "Modifique la información del socio seleccionado"
                          : "Complete la información para registrar un nuevo socio"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="cedula">Cédula *</Label>
                        <Input
                          id="cedula"
                          value={formData.cedula}
                          onChange={(e) =>
                            setFormData({ ...formData, cedula: e.target.value })
                          }
                          placeholder="0502399397"
                          disabled={isEditMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellidos_nombres">
                          Apellidos y Nombres *
                        </Label>
                        <Input
                          id="apellidos_nombres"
                          value={formData.apellidos_nombres}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              apellidos_nombres: e.target.value,
                            })
                          }
                          placeholder="Pérez González Juan Carlos"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="campus">Campus *</Label>
                        <Select
                          value={formData.campus}
                          onValueChange={(value) =>
                            setFormData({ ...formData, campus: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BELISARIO">Belisario</SelectItem>
                            <SelectItem value="CENTRO">Centro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="genero">Género *</Label>
                        <Select
                          value={formData.genero}
                          onValueChange={(value) =>
                            setFormData({ ...formData, genero: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Masculino</SelectItem>
                            <SelectItem value="F">Femenino</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regimen">Régimen *</Label>
                        <Select
                          value={formData.regimen}
                          onValueChange={(value) =>
                            setFormData({ ...formData, regimen: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADHERENTE">Adherente</SelectItem>
                            <SelectItem value="AFILIADO">Afiliado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="celular">Celular</Label>
                        <Input
                          id="celular"
                          value={formData.celular}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              celular: e.target.value,
                            })
                          }
                          placeholder="0991234567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rol">Rol *</Label>
                        <Select
                          value={formData.rol}
                          onValueChange={(value) =>
                            setFormData({ ...formData, rol: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="socio">Socio</SelectItem>
                            <SelectItem value="tesorero">Tesorero</SelectItem>
                            <SelectItem value="secretaria">
                              Secretaria
                            </SelectItem>
                            <SelectItem value="presidente">
                              Presidente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input
                          id="cargo"
                          value={formData.cargo}
                          onChange={(e) =>
                            setFormData({ ...formData, cargo: e.target.value })
                          }
                          placeholder="Miembro Activo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fecha_afiliacion">
                          Fecha de Afiliación
                        </Label>
                        <Input
                          id="fecha_afiliacion"
                          type="date"
                          value={formData.fecha_afiliacion}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fecha_afiliacion: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="correo">Correo Electrónico</Label>
                        <Input
                          id="correo"
                          type="email"
                          value={formData.correo}
                          onChange={(e) =>
                            setFormData({ ...formData, correo: e.target.value })
                          }
                          placeholder="usuario@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tipo_usuario">Tipo de Usuario *</Label>
                        <Select
                          value={formData.tipo_usuario}
                          onValueChange={(value) =>
                            setFormData({ ...formData, tipo_usuario: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADHERENTE">Adherente</SelectItem>
                            <SelectItem value="AFILIADO">Afiliado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Textarea
                          id="direccion"
                          value={formData.direccion}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              direccion: e.target.value,
                            })
                          }
                          placeholder="Dirección completa del socio"
                          rows={2}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea
                          id="observaciones"
                          value={formData.observaciones}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              observaciones: e.target.value,
                            })
                          }
                          placeholder="Observaciones adicionales sobre el socio"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleSubmit}>
                        {isEditMode ? "Actualizar" : "Crear"} Socio
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Estadísticas */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Socios
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalSocios}</div>
                    <p className="text-xs text-muted-foreground">
                      Socios registrados en el sistema
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Socios Activos
                    </CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {socios.filter((s) => s.rol === "socio").length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Miembros regulares
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Directiva
                    </CardTitle>
                    <Crown className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        socios.filter((s) =>
                          ["presidente", "tesorero", "secretaria"].includes(
                            s.rol
                          )
                        ).length
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Cargos directivos
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Campus
                    </CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Set(socios.map((s) => s.campus)).size}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Campus activos
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Filtros y Búsqueda */}
              <Card>
                <CardHeader>
                  <CardTitle>Filtros y Búsqueda</CardTitle>
                  <CardDescription>
                    Filtre y busque socios específicos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar por nombre o cédula..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={filterCampus}
                      onValueChange={handleCampusChange}
                    >
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
                  </div>
                </CardContent>
              </Card>

              {/* Tabla de Socios */}
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Socios</CardTitle>
                  <CardDescription>
                    Mostrando {(paginaActual - 1) * limitePorPagina + 1} a{" "}
                    {Math.min(paginaActual * limitePorPagina, totalSocios)} de{" "}
                    {totalSocios} socios
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cédula</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Campus</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Contacto</TableHead>
                            <TableHead>Fecha Afiliación</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {socios.map((socio) => (
                            <TableRow key={socio.cedula}>
                              <TableCell className="font-mono">
                                {socio.cedula}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {socio.apellidos_nombres || "Sin nombre"}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {socio.cargo || "Sin cargo"}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={getCampusBadgeVariant(
                                    socio.campus || ""
                                  )}
                                >
                                  {socio.campus || "No especificado"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={getRolBadgeVariant(socio.rol || "")}
                                >
                                  {socio.rol || "Sin rol"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {socio.celular && (
                                    <div className="flex items-center text-sm">
                                      <Phone className="h-3 w-3 mr-1" />
                                      {socio.celular}
                                    </div>
                                  )}
                                  {socio.correo && (
                                    <div className="flex items-center text-sm">
                                      <Mail className="h-3 w-3 mr-1" />
                                      {socio.correo}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {formatDate(socio.fecha_afiliacion || "")}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditDialog(socio)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(socio.cedula)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Paginación */}
                      {totalPaginas > 1 && (
                        <div className="flex items-center justify-between mt-6">
                          <div className="text-sm text-gray-600">
                            Página {paginaActual} de {totalPaginas}
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
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
