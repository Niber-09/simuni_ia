import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Search, 
  Clock, 
  Shield, 
  Zap, 
  Users,
  CheckCircle,
  ArrowRight,
  Building2,
  Brain,
  ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "IA Inteligente",
      description: "Clasificación automática de trámites con inteligencia artificial avanzada"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Seguimiento en Tiempo Real",
      description: "Consulta el estado de tus trámites 24/7 con tu DNI"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Seguro y Confiable",
      description: "Tus datos están protegidos con los más altos estándares de seguridad"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Rápido y Eficiente",
      description: "Procesos optimizados para reducir tiempos de espera"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Registra tu Trámite",
      description: "Completa el formulario con tus datos y descripción del trámite"
    },
    {
      number: "02", 
      title: "IA Clasifica Automáticamente",
      description: "Nuestro sistema inteligente categoriza y asigna prioridad"
    },
    {
      number: "03",
      title: "Recibe tu Código",
      description: "Obtén un código único para hacer seguimiento"
    },
    {
      number: "04",
      title: "Consulta el Estado",
      description: "Usa tu DNI o tu codigo de seguimiento para ver el progreso en tiempo real"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
  <div className="absolute inset-0 municipal-gradient opacity-10"></div>
  {/* This is the main container for both text/buttons and the image */}
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-12">
    {/* Text and Buttons Section: This div now acts as a flex item */}
    <div className="lg:w-1/2">
      {/* This inner div handles text alignment */}
      <div className="text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-shadow">
            Sistema Municipal
            <span className="block bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
              Inteligente
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed lg:mx-0">
            Gestiona tus trámites municipales de forma inteligente. Sin registros, sin complicaciones. 
            Nuestra IA clasifica automáticamente tu solicitud y te mantiene informado en tiempo real.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center lg:justify-start"
        >
          <Link to="/solicitar">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
              <FileText className="mr-2 h-5 w-5" />
              Solicitar Trámite
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/seguimiento">
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
              <Search className="mr-2 h-5 w-5" />
              Consultar Estado
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
    {/* Image Section: This div is the other flex item */}
    <div className="flex-1 lg:w-1/2 mt-8 lg:mt-0 flex justify-center items-center">
      <img
        src="src/img/ser1.jpg"
        alt="Trámites Municipales"
        className="w-full max-w-md mx-auto"
      />
    </div>
  </div>
  
  {/* Floating circles - These remain unchanged */}
  <div className="absolute top-20 left-10 animate-float">
    <div className="w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
  </div>
  <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
    <div className="w-16 h-16 bg-purple-200 rounded-full opacity-20"></div>
  </div>
  <div className="absolute bottom-20 left-1/4 animate-float" style={{ animationDelay: '4s' }}>
    <div className="w-12 h-12 bg-indigo-200 rounded-full opacity-20"></div>
  </div>
</section>

      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir SIMUNI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tecnología de vanguardia al servicio de la ciudadanía
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Proceso simple y automatizado en 4 pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 items-start">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-[calc(100%_-_1rem)] w-12 h-12 items-center justify-center">
                    <ChevronRight className="h-8 w-8 text-blue-400" />
                  </div>
                )}
                 {index < steps.length - 1 && (
                  <div className="lg:hidden flex w-full h-12 items-center justify-center mt-4">
                    <ChevronRight className="h-8 w-8 text-blue-400 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-xl opacity-90">Precisión de IA</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-xl opacity-90">Disponibilidad</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2">-50%</div>
              <div className="text-xl opacity-90">Tiempo de Procesamiento</div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Únete a miles de ciudadanos que ya utilizan SIMUNI para gestionar sus trámites municipales
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/solicitar">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                  <FileText className="mr-2 h-5 w-5" />
                  Iniciar Trámite Ahora
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 municipal-gradient rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">SIMUNI</span>
                  <p className="text-sm text-gray-400">Sistema Municipal Inteligente</p>
                </div>
              </div>
              <p className="text-gray-400">
                Gestion inteligente de trámites municipales. Simplifica tu vida con nuestra plataforma automatizada y segura.
              </p>
            </div>
            
            <div>
              <span className="text-lg font-semibold mb-4 block">Enlaces Rápidos</span>
              <div className="space-y-2">
                <Link to="/solicitar" className="block text-gray-400 hover:text-white transition-colors">
                  Solicitar Trámite
                </Link>
                <Link to="/seguimiento" className="block text-gray-400 hover:text-white transition-colors">
                  Seguimiento
                </Link>
                <Link to="/admin/login" className="block text-gray-400 hover:text-white transition-colors">
                  Administración
                </Link>
              </div>
            </div>
            
            <div>
              <span className="text-lg font-semibold mb-4 block">Contacto</span>
              <div className="space-y-2 text-gray-400">
                <p>📧 simuniservicios@simuni.com</p>
                <p>📞 (01) 3154000</p>
                <p>📞 (+51) 904 042 556</p>
                <p> Av. Nicolás de Piérola 545, Lima 15001</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SIMUNI - Sistema Municipal Inteligente. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;