"use client"

import { useState } from "react"
import Link from "next/link"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyRound, ArrowLeft } from "lucide-react"

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

const forgotPasswordSchema = yup.object({
  cedula: yup
    .string()
    .required("La cédula es obligatoria")
    .matches(/^\d{10}$/, "La cédula debe tener 10 dígitos")
    .test("cedula-valida", "Cédula inválida", validarCedulaEcuatoriana),
  correo: yup.string().required("El correo es obligatorio").email("Formato de correo inválido"),
})

type ForgotPasswordForm = yup.InferType<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true)
    setError("")

    try {
      // Simular envío de recuperación - aquí conectarías con tu backend
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Solicitud de recuperación:", data)
      setSuccess(true)
    } catch (err) {
      setError("Error al procesar la solicitud. Verifique sus datos e intente nuevamente.")
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
              <KeyRound className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡Solicitud Enviada!</h2>
            <p className="text-gray-600 mb-6">
              Se han enviado las instrucciones para recuperar su contraseña al correo electrónico registrado. Revise su
              bandeja de entrada y spam.
            </p>
            <Link href="/login">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <KeyRound className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
          <CardDescription>Ingrese su cédula y correo para recuperar el acceso a su cuenta</CardDescription>
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
              <Label htmlFor="correo">Correo Electrónico</Label>
              <Input
                id="correo"
                type="email"
                placeholder="usuario@universidad.edu.ec"
                {...register("correo")}
                className={errors.correo ? "border-red-500" : ""}
              />
              {errors.correo && <p className="text-sm text-red-500">{errors.correo.message}</p>}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Recuperar Contraseña"}
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-indigo-600 hover:underline flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al login
              </Link>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Información importante:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Debe usar la cédula y correo registrados en el sistema</li>
              <li>• Recibirá un enlace temporal para restablecer su contraseña</li>
              <li>• El enlace expira en 24 horas por seguridad</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
