import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  CalendarDays,
  MapPin,
  Mail,
  Brain,
  ListChecks,
  Fingerprint,
  CalendarCheck2
} from 'lucide-react';
import { getPrioridadColor, getPrioridadIcon, estadosProgresoInfo } from '@/lib/iaUtils';

const SeguimientoTramite = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('dni'); // 'dni' o 'codigo'
  const [tramitesEncontrados, setTramitesEncontrados] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Error de Búsqueda",
        description: `Por favor ingresa un ${searchType === 'dni' ? 'DNI' : 'código de trámite'}.`,
        variant: "destructive"
      });
      return;
    }

    if (searchType === 'dni' && (searchTerm.length !== 8 || !/^\d+$/.test(searchTerm))) {
      toast({
        title: "Error de DNI",
        description: "El DNI debe tener 8 dígitos numéricos.",
        variant: "destructive"
      });
      return;
    }
    
    if (searchType === 'codigo' && !searchTerm.startsWith('SITRAM-')) {
         toast({
        title: "Error de Código",
        description: "El código de trámite debe empezar con 'SITRAM-'.",
        variant: "destructive"
      });
      return;
    }


    setIsSearching(true);
    setHasSearched(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const todosLosTramites = JSON.parse(localStorage.getItem('tramites') || '[]');
      
      let resultados;
      if (searchType === 'dni') {
        resultados = todosLosTramites.filter(t => t.dni === searchTerm);
      } else {
        resultados = todosLosTramites.filter(t => t.codigo === searchTerm);
      }

      setTramitesEncontrados(resultados);

      if (resultados.length === 0) {
        toast({
          title: "Sin Resultados",
          description: `No se encontraron trámites para el ${searchType === 'dni' ? 'DNI' : 'código'} ingresado.`,
        });
      } else {
        toast({
          title: "Búsqueda Exitosa",
          description: `Se encontraron ${resultados.length} trámite(s).`,
        });
      }

    } catch (error) {
      toast({
        title: "Error Inesperado",
        description: "Hubo un problema al buscar los trámites. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const ProgressBar = ({ estado }) => {
    const estadoActualInfo = estadosProgresoInfo[estado] || { orden: 0, color: 'bg-gray-500' };
    const totalPasos = Object.keys(estadosProgresoInfo).length;
    const progreso = (estadoActualInfo.orden / totalPasos) * 100;

    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ${estadoActualInfo.color}`}
          style={{ width: `${progreso}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Seguimiento de Trámites
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Consulta el estado de tus solicitudes ingresando tu DNI o código de trámite.
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center">
              <Search className="mr-3 h-6 w-6" />
              Buscar Trámites
            </CardTitle>
            <CardDescription className="text-blue-100">
              Selecciona el tipo de búsqueda e ingresa la información.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="flex space-x-4 mb-4">
                <Button type="button" variant={searchType === 'dni' ? 'default' : 'outline'} onClick={() => setSearchType('dni')}>Por DNI</Button>
                <Button type="button" variant={searchType === 'codigo' ? 'default' : 'outline'} onClick={() => setSearchType('codigo')}>Por Código</Button>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="searchTerm">
                    {searchType === 'dni' ? 'Número de DNI' : 'Código de Trámite'}
                  </Label>
                  <Input
                    id="searchTerm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchType === 'dni' ? '12345678' : 'SITRAM-XXXXXX'}
                    maxLength={searchType === 'dni' ? 8 : 15}
                    className="text-lg py-3"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={isSearching} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-400 hover:to-blue-400 text-white px-8 py-3 text-lg h-12 w-full md:w-auto">
                    {isSearching ? <><Search className="mr-2 h-5 w-5 animate-spin" /> Buscando...</> : <><Search className="mr-2 h-5 w-5" /> Buscar</>}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {hasSearched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {tramitesEncontrados.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron trámites</h3>
                  <p className="text-gray-600 mb-6">No hay trámites registrados con la información proporcionada.</p>
                  <Button onClick={() => window.location.href = '/solicitar'} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <FileText className="mr-2 h-4 w-4" /> Registrar Nuevo Trámite
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Trámites Encontrados</h2>
                  <p className="text-gray-600">Se encontraron {tramitesEncontrados.length} trámite(s).</p>
                </div>
                {tramitesEncontrados.map((tramite, index) => (
                  <motion.div key={tramite.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm card-hover">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <CardTitle className="text-xl flex items-center">
                              <Fingerprint className="mr-2 h-5 w-5 text-blue-600" /> Código: {tramite.codigo}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Registrado el {new Date(tramite.fechaCreacion).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2 mt-4 md:mt-0">
                            <Badge className={`${getPrioridadColor(tramite.prioridad)} text-white`}>
                              {getPrioridadIcon(tramite.prioridad)}
                              <span className="ml-1 capitalize">{tramite.prioridad}</span>
                            </Badge>
                            <Badge className={`${(estadosProgresoInfo[tramite.estado] || {}).color || 'bg-gray-500'} text-white`}>
                              {tramite.estado}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <User className="h-5 w-5 mr-2 text-blue-600" /> Información del Solicitante
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div><span className="text-sm text-gray-600">Nombre:</span><p className="font-medium">{tramite.nombreCompleto}</p></div>
                            <div><span className="text-sm text-gray-600">DNI:</span><p className="font-medium">{tramite.dni}</p></div>
                            {tramite.email && <div><span className="text-sm text-gray-600">Email:</span><p className="font-medium flex items-center"><Mail className="h-4 w-4 mr-1 text-gray-400" />{tramite.email}</p></div>}
                            <div><span className="text-sm text-gray-600">Distrito:</span><p className="font-medium flex items-center"><MapPin className="h-4 w-4 mr-1 text-gray-400" />{tramite.distrito}</p></div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <Brain className="h-5 w-5 mr-2 text-purple-600" /> Detalles del Trámite (IA)
                          </h4>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Tipo de Trámite:</span>
                              <Badge variant="outline" className="bg-purple-100 text-purple-700">{tramite.tipoTramite}</Badge>
                            </div>
                             <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Clasificación IA:</span>
                              <Badge variant="outline" className="bg-purple-100 text-purple-700">{tramite.tipo}</Badge>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Tiempo Estimado:</span>
                              <Badge variant="outline" className="bg-purple-100 text-purple-700">
                                <CalendarCheck2 className="h-4 w-4 mr-1" />
                                {tramite.diasEstimados || 'No especificado'}
                              </Badge>
                            </div>
                            <div className="mt-3">
                              <span className="text-sm text-gray-600 block mb-1">Descripción:</span>
                              <p className="text-gray-800 bg-white p-3 rounded border text-sm">{tramite.descripcion}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <ListChecks className="h-5 w-5 mr-2 text-green-600" /> Estado y Progreso
                          </h4>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm text-gray-600">Estado Actual:</span>
                              <Badge className={`${(estadosProgresoInfo[tramite.estado] || {}).color || 'bg-gray-500'} text-white`}>{tramite.estado}</Badge>
                            </div>
                            <ProgressBar estado={tramite.estado} />
                            <p className="text-sm text-gray-600 mt-3">{(estadosProgresoInfo[tramite.estado] || {}).descripcion || 'Estado no definido.'}</p>
                            <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                              <span>Última actualización:</span>
                              <span>{new Date(tramite.fechaActualizacion).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SeguimientoTramite;