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
        src="data:image/jpeg;base64,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"
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