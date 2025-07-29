import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, FileText, TrendingUp, Phone, Mail, MapPin } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">ASODAT</h1>
                <p className="text-sm text-gray-600">UFA-ESPE Sede Latacunga</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenido a <span className="text-indigo-600">ASODAT</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Asociación de Docentes, Personal Administrativo y Trabajadores de la Universidad de las Fuerzas Armadas
            "ESPE" sede Latacunga. Unidos desde el 23 de octubre de 2023 por el bienestar y desarrollo de nuestros
            miembros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Afiliarse Ahora
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Conocer Más
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Servicios para Nuestros Socios</h2>
            <p className="text-lg text-gray-600">Ofrecemos una amplia gama de beneficios y servicios</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Gestión de Socios</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Sistema completo para el registro y gestión de información de socios</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Control de Aportes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Seguimiento detallado de aportes mensuales y estados de cuenta</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Comprobantes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Generación y gestión de comprobantes de pago digitales</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Seguridad</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Acceso seguro con validación de cédula y gestión de permisos</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-indigo-200">Miembros Activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1+</div>
              <div className="text-indigo-200">Año de Trayectoria</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-indigo-200">Compromiso</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contáctanos</h2>
            <p className="text-lg text-gray-600">Estamos aquí para ayudarte</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Teléfono</h3>
              <p className="text-gray-600">+593 (04) 123-4567</p>
            </div>
            <div className="text-center">
              <Mail className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600">info@asodat.org</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Dirección</h3>
              <p className="text-gray-600">UFA-ESPE Sede Latacunga, Ecuador</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">ASODAT</h3>
              <p className="text-gray-400 mb-4">
                Asociación de Docentes, Personal Administrativo y Trabajadores de la UFA-ESPE Sede Latacunga,
                comprometida con la unidad, solidaridad y bienestar de nuestros miembros desde 2023.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    Acerca de
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-white">
                    Noticias
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ASODAT. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
