"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
import { UserPlus, LogOut, Bell, ArrowLeft } from "lucide-react"
import Link from "next/link"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

// Validación de cédula ecuatoriana
const validarCedulaEcuatoriana = (cedula: string): boolean => {
  if (cedula.length !== 10) return false
  const digitos = cedula.split("").map(Number)
  const provincia = Number.parseInt(cedula.substring(0, 2))
  if (provincia < 1 || provincia > 24) return false
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
  let suma = 0
  for (let i = 0; i < 9; i++) {
    let resultado = digitos[i] * coeficientes[i]
    if (resultado > 9) resultado -= 9
    suma += resultado
  }
  const digitoVerificador = suma % 10 === 0 ? 0 : 10 - (suma % 10)
  return digitoVerificador === digitos[9]
}

const socioSchema = yup.object({
  apellidos_nombres: yup
    .string()
    .required("Los nombres y apellidos son obligatorios")
    .min(5, "Debe tener al menos 5 caracteres"),
  cedula: yup
    .string()
    .required("La cédula es obligatoria")
    .matches(/^\d{10}$/, "La cédula debe tener 10 dígitos")
    .test("cedula-valida", "Cédula inválida", validarCedulaEcuatoriana),
  correo: yup
    .string()
    .required("El correo es obligatorio")
    .email("Formato de correo inválido")
    .max(30, "El correo no puede exceder 30 caracteres"),
  celular: yup
    .string()
    .required("El celular es obligatorio")
    .matches(/^09\d{8}$/, "El celular debe tener formato 09XXXXXXXX"),
  campus: yup.string().required("El campus es obligatorio"),
  genero: yup.string().required("El género es obligatorio"),
  regimen: yup.string().required("El régimen es obligatorio"),
  cargo: yup.string().required("El cargo es obligatorio"),
  direccion: yup.string().required("La dirección es obligatoria"),
  tipo_usuario: yup.string().required("El tipo de usuario es obligatorio"),
  observaciones: yup.string(),
})

type SocioForm = yup.InferType<typeof socioSchema>

export default function NuevoSocioPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SocioForm>({
    resolver: yupResolver(socioSchema),
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.tipo !== "admin") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const onSubmit = async (data: SocioForm) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Nuevo socio:", data)
      router.push("/admin/socios")
    } catch (error) {
      console.error("Error al crear socio:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  return (
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
                  <BreadcrumbLink href="/admin/dashboard">Administración</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/socios">Socios</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Nuevo Socio</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Badge variant="secondary">Administrador</Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
            <div className="mb-6">
              <Link href="/admin/socios">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Socios
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <UserPlus className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <CardTitle>Registrar Nuevo Socio</CardTitle>
                    <CardDescription>Complete la información del nuevo socio de ASODAT</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Información Personal */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Personal</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="apellidos_nombres">Apellidos y Nombres *</Label>
                        <Input
                          id="apellidos_nombres"
                          placeholder="Ej: García López, María Elena"
                          {...register("apellidos_nombres")}
                          className={errors.apellidos_nombres ? "border-red-500" : ""}
                        />
                        {errors.apellidos_nombres && (
                          <p className="text-sm text-red-500">{errors.apellidos_nombres.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cedula">Cédula de Identidad *</Label>
                        <Input
                          id="cedula"
                          type="text"
                          placeholder="1234567890"
                          maxLength={10}
                          {...register("cedula")}
                          className={errors.cedula ? "border-red-500" : ""}
                        />
                        {errors.cedula && <p className="text-sm text-red-500">{errors.cedula.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="correo">Correo Electrónico *</Label>
                        <Input
                          id="correo"
                          type="email"
                          placeholder="usuario@espe.edu.ec"
                          maxLength={30}
                          {...register("correo")}
                          className={errors.correo ? "border-red-500" : ""}
                        />
                        {errors.correo && <p className="text-sm text-red-500">{errors.correo.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="celular">Celular *</Label>
                        <Input
                          id="celular"
                          type="text"
                          placeholder="0987654321"
                          maxLength={10}
                          {...register("celular")}
                          className={errors.celular ? "border-red-500" : ""}
                        />
                        {errors.celular && <p className="text-sm text-red-500">{errors.celular.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="genero">Género *</Label>
                        <Select onValueChange={(value) => setValue("genero", value)}>
                          <SelectTrigger className={errors.genero ? "border-red-500" : ""}>
                            <SelectValue placeholder="Seleccione género" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Masculino</SelectItem>
                            <SelectItem value="F">Femenino</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.genero && <p className="text-sm text-red-500">{errors.genero.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="campus">Campus *</Label>
                        <Select onValueChange={(value) => setValue("campus", value)}>
                          <SelectTrigger className={errors.campus ? "border-red-500" : ""}>
                            <SelectValue placeholder="Seleccione campus" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Latacunga">Latacunga</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.campus && <p className="text-sm text-red-500">{errors.campus.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección *</Label>
                      <Input
                        id="direccion"
                        placeholder="Dirección completa"
                        {...register("direccion")}
                        className={errors.direccion ? "border-red-500" : ""}
                      />
                      {errors.direccion && <p className="text-sm text-red-500">{errors.direccion.message}</p>}
                    </div>
                  </div>

                  {/* Información Laboral */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Laboral</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo *</Label>
                        <Input
                          id="cargo"
                          placeholder="Ej: Docente Titular, Personal Administrativo"
                          {...register("cargo")}
                          className={errors.cargo ? "border-red-500" : ""}
                        />
                        {errors.cargo && <p className="text-sm text-red-500">{errors.cargo.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="regimen">Régimen *</Label>
                        <Select onValueChange={(value) => setValue("regimen", value)}>
                          <SelectTrigger className={errors.regimen ? "border-red-500" : ""}>
                            <SelectValue placeholder="Seleccione régimen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tiempo Completo">Tiempo Completo</SelectItem>
                            <SelectItem value="Medio Tiempo">Medio Tiempo</SelectItem>
                            <SelectItem value="Tiempo Parcial">Tiempo Parcial</SelectItem>
                            <SelectItem value="Por Horas">Por Horas</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.regimen && <p className="text-sm text-red-500">{errors.regimen.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tipo_usuario">Tipo de Usuario *</Label>
                        <Select onValueChange={(value) => setValue("tipo_usuario", value)}>
                          <SelectTrigger className={errors.tipo_usuario ? "border-red-500" : ""}>
                            <SelectValue placeholder="Seleccione tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nuevo">Nuevo</SelectItem>
                            <SelectItem value="adherente">Adherente</SelectItem>
                            <SelectItem value="fundador">Fundador</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.tipo_usuario && <p className="text-sm text-red-500">{errors.tipo_usuario.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
                    <Textarea
                      id="observaciones"
                      placeholder="Información adicional sobre el socio"
                      rows={3}
                      {...register("observaciones")}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? "Registrando..." : "Registrar Socio"}
                    </Button>
                    <Link href="/admin/socios" className="flex-1">
                      <Button type="button" variant="outline" className="w-full bg-transparent">
                        Cancelar
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
