"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Eye, EyeOff } from "lucide-react"

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

const registerSchema = yup.object({
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
  contrasena: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmar_contrasena: yup
    .string()
    .required("Confirme la contraseña")
    .oneOf([yup.ref("contrasena")], "Las contraseñas no coinciden"),
  observaciones: yup.string(),
})

type RegisterForm = yup.InferType<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: yupResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setError("")

    try {
      // Simular registro - aquí conectarías con tu backend
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Datos del nuevo socio:", data)

      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError("Error al registrar el socio. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡Registro Exitoso!</h2>
            <p className="text-gray-600 mb-4">
              Su solicitud de afiliación ha sido enviada correctamente. Será redirigido al login en unos segundos.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <UserPlus className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Registro de Nuevo Socio</CardTitle>
          <CardDescription>Complete el formulario para solicitar su afiliación a ASODAT</CardDescription>
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
                    placeholder="usuario@universidad.edu.ec"
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
                      <SelectItem value="Guayaquil">Guayaquil</SelectItem>
                      <SelectItem value="Quito">Quito</SelectItem>
                      <SelectItem value="Cuenca">Cuenca</SelectItem>
                      <SelectItem value="Machala">Machala</SelectItem>
                      <SelectItem value="Portoviejo">Portoviejo</SelectItem>
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
                    placeholder="Ej: Docente Titular, Docente Auxiliar"
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
              </div>
            </div>

            {/* Seguridad */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Configuración de Acceso</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contrasena">Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="contrasena"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      {...register("contrasena")}
                      className={errors.contrasena ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.contrasena && <p className="text-sm text-red-500">{errors.contrasena.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmar_contrasena">Confirmar Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="confirmar_contrasena"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repita la contraseña"
                      {...register("confirmar_contrasena")}
                      className={errors.confirmar_contrasena ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmar_contrasena && (
                    <p className="text-sm text-red-500">{errors.confirmar_contrasena.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
              <Textarea
                id="observaciones"
                placeholder="Información adicional que desee agregar"
                rows={3}
                {...register("observaciones")}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar Socio"}
              </Button>
              <Link href="/login" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>

            <p className="text-xs text-gray-600 text-center">
              Al registrarse, acepta los términos y condiciones de ASODAT. Su solicitud será revisada por el
              administrador.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
