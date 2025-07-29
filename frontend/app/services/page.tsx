import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Scale,
  Shield,
  DollarSign,
  CreditCard,
  Heart,
  Users,
  Trophy,
  FileText,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"

export default function ServicesPage() {
  const servicios = [
    {
      icon: Scale,
      title: "Asistencia Legal y Administrativa",
      description: "Asesoría especializada en temas laborales, administrativos y legales para todos nuestros miembros.",
      features: [
        "Consultas legales gratuitas",
        "Asesoría en trámites administrativos",
        "Representación legal cuando sea necesario",
        "Orientación en derechos laborales",
      ],
    },
    {
      icon: Shield,
      title: "Defensa de Derechos Laborales",
      description: "Defensa activa y comprometida de los derechos laborales de nuestros miembros ante las autoridades.",
      features: [
        "Mediación en conflictos laborales",
        "Representación ante autoridades",
        "Seguimiento de casos",
        "Asesoría en normativas laborales",
      ],
    },
    {
      icon: DollarSign,
      title: "Asesoría Financiera y Económica",
      description: "Apoyo integral en la gestión financiera, acceso a cooperativas y orientación económica.",
      features: [
        "Planificación financiera personal",
        "Acceso a cooperativas de ahorro",
        "Asesoría en inversiones",
        "Educación financiera",
      ],
    },
    {
      icon: CreditCard,
      title: "Acceso a Créditos y Préstamos",
      description: "Condiciones preferenciales en préstamos personales y beneficios financieros exclusivos.",
      features: [
        "Tasas de interés preferenciales",
        "Trámites simplificados",
        "Plazos flexibles de pago",
        "Garantías solidarias",
      ],
    },
    {
      icon: Heart,
      title: "Beneficios Sociales y Culturales",
      description: "Participación en eventos culturales, sociales y recreativos organizados por la asociación.",
      features: [
        "Eventos culturales y artísticos",
        "Actividades recreativas familiares",
        "Celebraciones especiales",
        "Programas deportivos",
      ],
    },
    {
      icon: Users,
      title: "Solidaridad y Apoyo Mutuo",
      description: "Fomento de la colaboración, solidaridad y el espíritu de comunidad dentro de la asociación.",
      features: [
        "Red de apoyo entre miembros",
        "Fondo de solidaridad",
        "Apoyo en emergencias",
        "Programas de ayuda mutua",
      ],
    },
    {
      icon: Trophy,
      title: "Participación Democrática",
      description: "Derecho a elegir y ser elegido para cargos directivos, participando en decisiones importantes.",
      features: [
        "Voto en asambleas generales",
        "Postulación a cargos directivos",
        "Participación en comisiones",
        "Propuesta de iniciativas",
      ],
    },
    {
      icon: FileText,
      title: "Reembolsos y Viáticos",
      description: "Reembolsos de gastos para miembros de la directiva y comisiones en actividades institucionales.",
      features: [
        "Reembolso de gastos de representación",
        "Viáticos para actividades oficiales",
        "Compensación por tiempo dedicado",
        "Apoyo logístico en eventos",
      ],
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
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Nuestros Servicios</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre todos los beneficios y servicios exclusivos que ASODAT ofrece a sus miembros para mejorar su
            bienestar laboral, económico, social y cultural.
          </p>
        </section>

        {/* Servicios Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicios.map((servicio, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <servicio.icon className="h-10 w-10 text-indigo-600 mr-4" />
                    <div>
                      <CardTitle className="text-xl">{servicio.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-base">{servicio.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {servicio.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Proceso de Afiliación */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Cómo Afiliarse?</h2>
            <p className="text-lg text-gray-600">Proceso simple y rápido para formar parte de ASODAT</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-indigo-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Registro</h3>
                <p className="text-sm text-gray-600">
                  Complete el formulario de registro con sus datos personales y laborales
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-indigo-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Revisión</h3>
                <p className="text-sm text-gray-600">
                  Su solicitud será revisada por el equipo administrativo de ASODAT
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-indigo-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Aprobación</h3>
                <p className="text-sm text-gray-600">
                  Recibirá la confirmación de su afiliación y credenciales de acceso
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-indigo-600">4</span>
                </div>
                <h3 className="font-semibold mb-2">Beneficios</h3>
                <p className="text-sm text-gray-600">
                  Comience a disfrutar de todos los servicios y beneficios de ASODAT
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contacto */}
        <section className="mb-16">
          <Card className="bg-indigo-600 text-white">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">¿Necesita más información?</h2>
                <p className="text-indigo-100 text-lg">
                  Estamos aquí para ayudarle con cualquier consulta sobre nuestros servicios
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <Phone className="h-8 w-8 mx-auto mb-4 text-indigo-200" />
                  <h3 className="text-lg font-semibold mb-2">Teléfono</h3>
                  <p className="text-indigo-100">+593 (03) 281-1020</p>
                </div>
                <div>
                  <Mail className="h-8 w-8 mx-auto mb-4 text-indigo-200" />
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-indigo-100">info@asodat-latacunga.org</p>
                </div>
                <div>
                  <MapPin className="h-8 w-8 mx-auto mb-4 text-indigo-200" />
                  <h3 className="text-lg font-semibold mb-2">Ubicación</h3>
                  <p className="text-indigo-100">UFA-ESPE Sede Latacunga</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Únase a ASODAT Hoy!</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            No espere más para formar parte de nuestra comunidad y acceder a todos estos beneficios exclusivos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Solicitar Afiliación
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Contactar Ahora
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
