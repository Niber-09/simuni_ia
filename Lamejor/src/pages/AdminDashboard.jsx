import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Shield, FileText, Users, Clock, CheckCircle, AlertTriangle, RefreshCw, Brain, BarChart3, ArrowRight, ListChecks, Activity, TrendingUp, CalendarDays
} from 'lucide-react';
import { getPrioridadColor, getPrioridadIcon, getEstadoColor, estadosProgresoInfo } from '@/lib/iaUtils';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tramites, setTramites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    recibidos: 0,
    enProceso: 0,
    finalizados: 0,
    prioridadAlta: 0,
    promedioDias: 0,
  });
  const [recentTramites, setRecentTramites] = useState([]);
  const [tramitesPorDia, setTramitesPorDia] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      const tramitesData = JSON.parse(localStorage.getItem('tramites') || '[]');
      setTramites(tramitesData);

      const total = tramitesData.length;
      const recibidos = tramitesData.filter(t => t.estado === 'Recibido').length;
      const enProceso = tramitesData.filter(t => t.estado === 'En Proceso').length;
      const finalizados = tramitesData.filter(t => t.estado === 'Finalizado' || t.estado === 'Aprobado' || t.estado === 'Rechazado').length;
      const prioridadAlta = tramitesData.filter(t => t.prioridad === 'alta').length;
      
      let totalDias = 0;
      let tramitesConDuracion = 0;
      tramitesData.forEach(t => {
        if (t.fechaCreacion && t.fechaActualizacion && (t.estado === 'Finalizado' || t.estado === 'Aprobado' || t.estado === 'Rechazado')) {
          const inicio = new Date(t.fechaCreacion);
          const fin = new Date(t.fechaActualizacion);
          const diffTime = Math.abs(fin - inicio);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          totalDias += diffDays;
          tramitesConDuracion++;
        }
      });
      const promedioDias = tramitesConDuracion > 0 ? (totalDias / tramitesConDuracion).toFixed(1) : 0;

      setStats({ total, recibidos, enProceso, finalizados, prioridadAlta, promedioDias });
      
      const sortedTramites = [...tramitesData].sort((a,b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
      setRecentTramites(sortedTramites.slice(0, 5));

      const tramitesPorDiaData = tramitesData.reduce((acc, tramite) => {
        const fecha = new Date(tramite.fechaCreacion).toLocaleDateString('es-PE', { year: '2-digit', month: '2-digit', day: '2-digit' });
        acc[fecha] = (acc[fecha] || 0) + 1;
        return acc;
      }, {});

      const ultimos7dias = Object.entries(tramitesPorDiaData)
        .map(([name, value]) => ({ name, value }))
        .sort((a,b) => new Date(a.name.split('/').reverse().join('-')) - new Date(b.name.split('/').reverse().join('-'))) 
        .slice(-7); 
      setTramitesPorDia(ultimos7dias);


    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los datos del dashboard", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const estadosChartData = Object.entries(estadosProgresoInfo).map(([nombre, info]) => ({
    name: nombre,
    value: tramites.filter(t => t.estado === nombre).length,
    color: info.color.replace('bg-', '#').slice(0,7) 
  })).filter(e => e.value > 0);
  
  const tiposChartData = tramites.reduce((acc, t) => {
    const tipo = t.tipoTramite || 'No especificado'; 
    const existing = acc.find(item => item.name === tipo);
    if (existing) existing.value++;
    else acc.push({ name: tipo, value: 1 });
    return acc;
  }, []).sort((a,b) => b.value - a.value).slice(0,5);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <RefreshCw className="h-12 w-12 animate-spin text-blue-600" /> <p className="ml-3 text-lg">Cargando dashboard...</p>
      </div>
    );
  }
  
  const statCardsData = [
    { title: "Total Trámites", value: stats.total, icon: <FileText />, fromColor: "from-sky-500", toColor: "to-blue-600", span: "col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2" },
    { title: "En Proceso", value: stats.enProceso, icon: <Clock />, fromColor: "from-amber-500", toColor: "to-orange-600", span: "col-span-1" },
    { title: "Finalizados", value: stats.finalizados, icon: <CheckCircle />, fromColor: "from-emerald-500", toColor: "to-green-600", span: "col-span-1" },
    { title: "Prioridad Alta", value: stats.prioridadAlta, icon: <AlertTriangle />, fromColor: "from-rose-500", toColor: "to-red-600", span: "col-span-1" },
    { title: "Prom. Días Trámite", value: `${stats.promedioDias} días`, icon: <CalendarDays />, fromColor: "from-violet-500", toColor: "to-purple-600", span: "col-span-1" },
  ];


  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Shield className="mr-3 h-8 w-8 text-blue-600" /> Resumen General
          </h1>
          <Button onClick={loadDashboardData} variant="outline" size="sm" className="mt-4 md:mt-0">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Actualizar Datos
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {statCardsData.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className={stat.span}>
            <Card className={`border-0 shadow-lg bg-gradient-to-br ${stat.fromColor} ${stat.toColor} text-white h-full`}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className={`text-sm opacity-80`}>{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                {React.cloneElement(stat.icon, { className: `h-10 w-10 opacity-70`})}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-2">
          <Card className="border-0 shadow-lg h-full">
            <CardHeader><CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5 text-indigo-600" />Trámites Registrados (Últimos 7 días con datos)</CardTitle></CardHeader>
            <CardContent className="h-[350px]">
              {tramitesPorDia.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tramitesPorDia} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} name="Trámites" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">No hay datos suficientes para el gráfico de actividad.</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="border-0 shadow-lg h-full">
            <CardHeader><CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-teal-600" />Distribución de Estados</CardTitle></CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={estadosChartData} cx="50%" cy="50%" outerRadius={110} dataKey="value" labelLine={false} label={({ name, percent, value }) => `${name} (${value})`}>
                    {estadosChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color.startsWith('#') ? entry.color : `#${entry.color.split('-')[1]}`} />)}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} trámites`, name]}/>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-green-600" />Trámites Recientes</span>
                <Button variant="link" size="sm" onClick={() => navigate('/admin/tramites')}>Ver Todos <ArrowRight className="ml-1 h-4 w-4"/></Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTramites.length > 0 ? (
                <ul className="space-y-3">
                  {recentTramites.map(t => (
                    <li key={t.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                      <div>
                        <p className="font-semibold text-sm text-gray-700">{t.codigo} - <span className="font-normal">{t.tipoTramite}</span></p>
                        <p className="text-xs text-gray-500">{t.nombreCompleto} - {new Date(t.fechaCreacion).toLocaleDateString('es-PE')}</p>
                      </div>
                      <Badge className={`${getPrioridadColor(t.prioridad)} text-white capitalize text-xs`}>{getPrioridadIcon(t.prioridad)} {t.prioridad}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 py-4">No hay trámites recientes.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card className="border-0 shadow-lg h-full">
            <CardHeader><CardTitle className="flex items-center"><Brain className="mr-2 h-5 w-5 text-purple-600" />Tipos de Trámites Más Solicitados (Top 5)</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tiposChartData} layout="vertical" margin={{ left: 150, right: 20, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value, name) => [value, name]}/>
                  <Bar dataKey="value" fill="#8b5cf6" barSize={20} radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;