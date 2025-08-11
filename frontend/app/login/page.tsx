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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

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

const loginSchema = yup.object({
  cedula: yup
    .string()
    .required("La cédula es obligatoria")
    .matches(/^\d{10}$/, "La cédula debe tener 10 dígitos")
    .test("cedula-valida", "Cédula inválida", validarCedulaEcuatoriana),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(4, "La contraseña debe tener al menos 4 caracteres"),
})

type LoginForm = yup.InferType<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await login(data.cedula, data.password)

      if (result.success) {
        // Obtener el rol del usuario del localStorage
        const userRol = localStorage.getItem('user_rol')
        
        // Redirigir según el rol del usuario
        if (['admin', 'tesorero', 'secretaria', 'presidente'].includes(userRol || '')) {
          router.push("/admin/dashboard")
        } else {
          router.push("/socio/dashboard")
        }
      } else {
        setError(result.error || "Credenciales inválidas")
      }
    } catch (err) {
      console.error('Login error:', err)
      setError("Error de conexión. Verifique su conexión a internet.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <LogIn className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder al sistema ASODAT</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula de Identidad</Label>
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
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  {...register("password")}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
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
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="text-center space-y-2">
              <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                ¿Olvidó su contraseña?
              </Link>
              <div className="text-sm text-gray-600">
                ¿No tiene cuenta?{" "}
                <Link href="/register" className="text-indigo-600 hover:underline">
                  Regístrese aquí
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
