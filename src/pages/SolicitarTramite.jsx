import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Brain,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Map,
  ListChecks,
  CalendarCheck2
} from 'lucide-react';
import { clasificarTramiteIA, getPrioridadColor, getPrioridadIcon } from '@/lib/iaUtils';

const distritosLima = [
  "Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos", 
  "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María", "La Molina", 
  "La Victoria", "Lima", "Lince", "Los Olivos", "Lurigancho-Chosica", "Lurín", 
  "Magdalena del Mar", "Miraflores", "Pachacámac", "Pucusana", "Pueblo Libre", 
  "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo", 
  "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores", 
  "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita", "Santa María del Mar", 
  "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa María del Triunfo"
];

const tiposTramite = [
  "Certificado de Residencia", "Licencia de Construcción", "Licencia de Funcionamiento",
  "Pago de Impuestos", "Reclamo de Servicios", "Solicitud de Poda de Árbol", 
  "Permiso para Evento Público", "Constancia de Posesión", "Otros"
];

const SolicitarTramite = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    dni: '',
    email: '',
    distrito: '',
    tipoTramite: '',
    descripcion: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tramiteCreado, setTramiteCreado] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.nombreCompleto || !formData.dni || !formData.distrito || !formData.tipoTramite || !formData.descripcion) {
        toast({
          title: "Error de Validación",
          description: "Por favor completa todos los campos obligatorios.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      if (formData.dni.length !== 8 || !/^\d+$/.test(formData.dni)) {
        toast({
          title: "DNI Inválido",
          description: "El DNI debe contener 8 dígitos numéricos.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast({
          title: "Email Inválido",
          description: "Por favor, ingresa un correo electrónico válido.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      const clasificacion = clasificarTramiteIA(formData.descripcion, formData.tipoTramite);
      const codigo = `SITRAM-${Date.now().toString().slice(-6)}`;
      
      const nuevoTramite = {
        id: `SITRAM-${Date.now()}`,
        codigo,
        ...formData,
        tipo: clasificacion.tipo,
        prioridad: clasificacion.prioridad,
        areaAsignada: clasificacion.area || 'Mesa de Partes',
        diasEstimados: clasificacion.diasEstimados,
        estado: 'Recibido',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        historialEstados: [
          { estado: 'Recibido', fecha: new Date().toISOString(), comentario: 'Trámite registrado en el sistema.' }
        ]
      };

      const tramitesExistentes = JSON.parse(localStorage.getItem('tramites') || '[]');
      tramitesExistentes.push(nuevoTramite);
      localStorage.setItem('tramites', JSON.stringify(tramitesExistentes));

      setTramiteCreado(nuevoTramite);
      
      toast({
        title: "¡Trámite Registrado Exitosamente!",
        description: `Tu código es: ${codigo}. Clasificación IA: '${clasificacion.tipo}', Prioridad: '${clasificacion.prioridad}'. Tiempo estimado: ${clasificacion.diasEstimados}.`,
        duration: 10000,
        className: 'bg-green-100 border-green-400 text-green-700'
      });

      setFormData({
        nombreCompleto: '', dni: '', email: '', distrito: '', tipoTramite: '', descripcion: ''
      });

    } catch (error) {
      toast({
        title: "Error Inesperado",
        description: "Hubo un problema al registrar tu trámite. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tramiteCreado) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">¡Trámite Registrado Exitosamente!</CardTitle>
              <CardDescription className="text-green-100">
                Tu solicitud ha sido procesada por nuestro sistema inteligente.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-2">Tu código de seguimiento es:</p>
                  <div className="text-3xl font-bold text-blue-600 bg-blue-50 py-4 px-6 rounded-lg inline-block">
                    {tramiteCreado.codigo}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Guarda este código para consultar el estado de tu trámite.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-blue-500" />
                      Clasificación por IA
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tipo de Trámite:</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {tramiteCreado.tipo}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Prioridad:</span>
                        <Badge className={`${getPrioridadColor(tramiteCreado.prioridad)} text-white`}>
                          {getPrioridadIcon(tramiteCreado.prioridad)}
                          <span className="ml-1 capitalize">{tramiteCreado.prioridad}</span>
                        </Badge>
                      </div>
                       <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tiempo Estimado:</span>
                        <Badge variant="outline" className="bg-purple-50 text-blue-500">
                          <CalendarCheck2 className="h-4 w-4 mr-1" />
                          {tramiteCreado.diasEstimados}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Estado Actual</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Estado:</span>
                        <Badge className="bg-sky-500 text-white">
                          {tramiteCreado.estado}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Fecha:</span>
                        <span className="text-sm text-gray-900">
                          {new Date(tramiteCreado.fechaCreacion).toLocaleDateString('es-PE')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Área Asignada:</span>
                        <Badge variant="outline" className="bg-gray-100 text-gray-700">
                          {tramiteCreado.areaAsignada}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button 
                    onClick={() => setTramiteCreado(null)}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-purple-700"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Registrar Otro Trámite
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/seguimiento'}
                  >
                    Consultar Estado
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Solicitar Nuevo Trámite
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Completa el formulario y nuestro sistema inteligente clasificará automáticamente tu solicitud.
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center">
              <FileText className="mr-3 h-6 w-6" />
              Formulario de Solicitud
            </CardTitle>
            <CardDescription className="text-blue-100">
              Todos los campos marcados con * son obligatorios.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Datos Personales
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
                  <Input id="nombreCompleto" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleInputChange} placeholder="Ej: Juan Pérez García" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI *</Label>
                    <Input id="dni" name="dni" value={formData.dni} onChange={handleInputChange} placeholder="12345678" maxLength="8" pattern="[0-9]{8}" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="tu@correo.com" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Map className="h-5 w-5 mr-2 text-green-600" />
                  Ubicación y Tipo de Trámite
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distrito">Distrito *</Label>
                    <select id="distrito" name="distrito" value={formData.distrito} onChange={handleInputChange} required className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option value="">Selecciona un distrito</option>
                      {distritosLima.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoTramite">Tipo de Trámite *</Label>
                    <select id="tipoTramite" name="tipoTramite" value={formData.tipoTramite} onChange={handleInputChange} required className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option value="">Selecciona un tipo</option>
                      {tiposTramite.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ListChecks className="h-5 w-5 mr-2 text-purple-600" />
                  Descripción del Trámite
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Describe tu solicitud *</Label>
                  <Textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Describe detalladamente el trámite que necesitas realizar..." rows={5} required />
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white py-3 text-lg">
                  {isSubmitting ? (
                    <><Brain className="mr-2 h-5 w-5 animate-spin" /> Procesando con IA...</>
                  ) : (
                    <><Send className="mr-2 h-5 w-5" /> Enviar Solicitud</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SolicitarTramite;