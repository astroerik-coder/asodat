import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Target,
  Eye,
  Calendar,
  Shield,
  DollarSign,
  BookOpen,
  Heart,
  Scale,
  Handshake,
  Trophy,
  CreditCard,
  TrendingUp,
} from "lucide-react"

export default function AboutPage() {
  const objetivos = [
    {
      icon: Users,
      title: "Unidad y solidaridad",
      description:
        "Fomentar la unidad y solidaridad entre los miembros para contribuir al desarrollo y progreso de la Universidad de las Fuerzas Armadas ESPE (UFA-ESPE) Sede Latacunga.",
    },
    {
      icon: TrendingUp,
      title: "Mejoramiento de condiciones",
      description:
        "Mejorar las condiciones laborales, económicas, sociales, deportivas y culturales de los miembros a través de programas y actividades específicas.",
    },
    {
      icon: Shield,
      title: "Defensa de derechos",
      description:
        "Defender los derechos laborales, constitucionales y legales de los asociados, brindándoles asesoría administrativa y legal.",
    },
    {
      icon: Handshake,
      title: "Cooperativas y servicios",
      description: "Crear cooperativas y servicios de asistencia para el beneficio de los miembros de la Asociación.",
    },
    {
      icon: BookOpen,
      title: "Colaboración académica y administrativa",
      description:
        "Colaborar con la gestión académica y administrativa de la UFA-ESPE Sede Latacunga a través de la interacción directa con sus autoridades y presentación de proyectos.",
    },
    {
      icon: Trophy,
      title: "Participación activa",
      description:
        "Participar activamente en eventos académicos, culturales, deportivos y de vinculación organizados por la Universidad o por la Asociación.",
    },
  ]

  const beneficios = [
    {
      icon: Scale,
      title: "Asistencia Legal y Administrativa",
      description: "Asesoría en temas laborales, administrativos y legales para nuestros miembros.",
    },
    {
      icon: Shield,
      title: "Defensa de los Derechos Laborales",
      description: "Defensa activa de los derechos laborales de nuestros miembros ante las autoridades.",
    },
    {
      icon: DollarSign,
      title: "Asesoría Financiera y Económica",
      description: "Asesoría y apoyo económico en la gestión financiera, acceso a cooperativas y préstamos.",
    },
    {
      icon: CreditCard,
      title: "Acceso a Créditos y Préstamos",
      description: "Condiciones preferenciales en préstamos personales y beneficios asociados.",
    },
    {
      icon: Heart,
      title: "Beneficios Sociales y Culturales",
      description: "Participación en eventos culturales, sociales y recreativos organizados por la asociación.",
    },
    {
      icon: Users,
      title: "Solidaridad y Apoyo entre Miembros",
      description: "Fomento de la colaboración, solidaridad y el espíritu de comunidad dentro de la asociación.",
    },
    {
      icon: Trophy,
      title: "Participación Activa en Decisiones",
      description: "Derecho a elegir y ser elegido para cargos directivos, participando en decisiones importantes.",
    },
    {
      icon: DollarSign,
      title: "Acceso a Reembolsos y Viáticos",
      description:
        "Reembolsos de gastos para miembros de la directiva y comisiones al realizar actividades institucionales.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">ASODAT</h1>
                <p className="text-sm text-gray-600">UFA-ESPE Sede Latacunga</p>
              </div>
            </Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Historia */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              Fundada el 23 de octubre de 2023
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Historia de ASODAT</h1>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                La Asociación de Docentes, Personal Administrativo y Trabajadores de la Universidad de las Fuerzas
                Armadas "ESPE" sede Latacunga fue constituida con el objetivo de fortalecer la unidad y el bienestar de
                sus miembros. Surgió del compromiso y esfuerzo colectivo de sus fundadores el{" "}
                <strong>23 de octubre de 2023</strong>.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Misión y Visión */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-indigo-600 mr-3" />
                  <CardTitle className="text-2xl">Misión</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Fomentar el espíritu de unidad, solidaridad, pertenencia y compañerismo entre los socios, para
                  coadyuvar en el desarrollo y progreso de la Universidad, promoviendo el mejoramiento laboral,
                  económico, social y cultural.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Eye className="h-8 w-8 text-indigo-600 mr-3" />
                  <CardTitle className="text-2xl">Visión</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Ser una organización sólida y representativa que defienda los derechos de sus miembros, brinde
                  servicios de calidad y contribuya activamente al fortalecimiento institucional de la UFA-ESPE sede
                  Latacunga.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Objetivos */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Objetivos</h2>
            <p className="text-lg text-gray-600">Comprometidos con el desarrollo integral de nuestros miembros</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objetivos.map((objetivo, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <objetivo.icon className="h-10 w-10 text-indigo-600 mb-4" />
                  <CardTitle className="text-lg">{objetivo.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{objetivo.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Beneficios */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Beneficios para Nuestros Miembros</h2>
            <p className="text-lg text-gray-600">Servicios y ventajas exclusivas para los asociados</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficios.map((beneficio, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <beneficio.icon className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                  <CardTitle className="text-base">{beneficio.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm text-center leading-relaxed">{beneficio.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Listo para unirte a ASODAT?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Forma parte de nuestra comunidad y disfruta de todos los beneficios que tenemos para ofrecerte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Solicitar Afiliación
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Más Información
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
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
                  <Link href="/" className="hover:text-white">
                    Inicio
                  </Link>
                </li>
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
            <p>&copy; 2024 ASODAT - UFA-ESPE Sede Latacunga. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
