"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  ArrowLeft,
  Save,
  LogOut,
  Bell,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

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

export default function NuevoSocioPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.cedula || !formData.apellidos_nombres) {
      alert("La cédula y los apellidos y nombres son obligatorios");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // TODO: Implementar creación de socio
      console.log("Creando socio:", formData);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir a la lista de socios
      router.push("/admin/socios");
    } catch (error) {
      console.error("Error al crear socio:", error);
      alert("Error al crear el socio. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleBack = () => {
    router.push("/admin/socios");
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
                  <BreadcrumbLink href="/admin/socios">Gestión de Socios</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Nuevo Socio</BreadcrumbPage>
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
                    Nuevo Socio
                  </h1>
                  <p className="text-muted-foreground">
                    Complete la información para registrar un nuevo socio en el sistema
                  </p>
                </div>
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Información Personal
                    </CardTitle>
                    <CardDescription>
                      Datos básicos del nuevo socio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cedula">Cédula *</Label>
                        <Input
                          id="cedula"
                          value={formData.cedula}
                          onChange={(e) =>
                            setFormData({ ...formData, cedula: e.target.value })
                          }
                          placeholder="0502399397"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellidos_nombres">Apellidos y Nombres *</Label>
                        <Input
                          id="apellidos_nombres"
                          value={formData.apellidos_nombres}
                          onChange={(e) =>
                            setFormData({ ...formData, apellidos_nombres: e.target.value })
                          }
                          placeholder="Pérez González Juan Carlos"
                          required
                        />
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
                        <Label htmlFor="fecha_afiliacion">Fecha de Afiliación</Label>
                        <Input
                          id="fecha_afiliacion"
                          type="date"
                          value={formData.fecha_afiliacion}
                          onChange={(e) =>
                            setFormData({ ...formData, fecha_afiliacion: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Información Institucional
                    </CardTitle>
                    <CardDescription>
                      Datos relacionados con la afiliación y rol en la organización
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <SelectItem value="secretaria">Secretaria</SelectItem>
                            <SelectItem value="presidente">Presidente</SelectItem>
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
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Información de Contacto
                    </CardTitle>
                    <CardDescription>
                      Datos para comunicarse con el socio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="celular">Celular</Label>
                        <Input
                          id="celular"
                          value={formData.celular}
                          onChange={(e) =>
                            setFormData({ ...formData, celular: e.target.value })
                          }
                          placeholder="0991234567"
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      <Textarea
                        id="direccion"
                        value={formData.direccion}
                        onChange={(e) =>
                          setFormData({ ...formData, direccion: e.target.value })
                        }
                        placeholder="Dirección completa del socio"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Información Adicional
                    </CardTitle>
                    <CardDescription>
                      Observaciones y notas adicionales
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <Textarea
                        id="observaciones"
                        value={formData.observaciones}
                        onChange={(e) =>
                          setFormData({ ...formData, observaciones: e.target.value })
                        }
                        placeholder="Observaciones adicionales sobre el socio"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Botones de Acción */}
                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline" onClick={handleBack}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Socio
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
