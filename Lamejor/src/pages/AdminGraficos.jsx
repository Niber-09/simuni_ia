
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { RefreshCw, Brain, BarChart3, ListChecks, Users, CalendarDays, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { estadosProgresoInfo } from '@/lib/iaUtils';

const AdminGraficos = () => {
  const { toast } = useToast();
  const [tramites, setTramites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGraficosData();
  }, []);

  const loadGraficosData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      const tramitesData = JSON.parse(localStorage.getItem('tramites') || '[]');
      setTramites(tramitesData);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los datos para los gráficos", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS_PIE = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF', '#19AFFF'];

  const estadosChartData = Object.entries(estadosProgresoInfo).map(([nombre, info], index) => ({
    name: nombre,
    value: tramites.filter(t => t.estado === nombre).length,
    fill: info.color.startsWith('bg-') ? `#${info.color.split('-')[1]}` : info.color,
  })).filter(e => e.value > 0);
  
  const tiposChartData = tramites.reduce((acc, t) => {
    const tipo = t.tipoTramite || 'No Especificado'; 
    const existing = acc.find(item => item.name === tipo);
    if (existing) existing.value++;
    else acc.push({ name: tipo, value: 1 });
    return acc;
  }, []).sort((a,b) => b.value - a.value);

  const prioridadChartData = ['alta', 'media', 'baja'].map((p, index) => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    value: tramites.filter(t => t.prioridad === p).length,
    fill: p === 'alta' ? '#EF4444' : p === 'media' ? '#F59E0B' : '#22C55E',
  })).filter(e => e.value > 0);

  const tramitesPorMesData = tramites.reduce((acc, tramite) => {
    const mes = new Date(tramite.fechaCreacion).toLocaleDateString('es-PE', { month: 'short', year: '2-digit' });
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {});

  const tramitesPorMesChart = Object.entries(tramitesPorMesData)
    .map(([name, value]) => ({ name, trámites: value }))
    .sort((a,b) => {
        const [mesA, anioA] = a.name.split(' ');
        const [mesB, anioB] = b.name.split(' ');
        const dateA = new Date(`01-${mesA}-20${anioA}`);
        const dateB = new Date(`01-${mesB}-20${anioB}`);
        return dateA - dateB;
    });


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <RefreshCw className="h-12 w-12 animate-spin text-blue-600" /> <p className="ml-3 text-lg">Cargando gráficos...</p>
      </div>
    );
  }
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent * 100 < 5) return null; 
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="10px">
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };


  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-indigo-600" /> Visualización de Datos
          </h1>
           <Button onClick={loadGraficosData} variant="outline" size="sm" className="mt-4 md:mt-0">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Actualizar Gráficos
          </Button>
        </div>
      </motion.div>

      {tramites.length === 0 && !isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 bg-white shadow-lg rounded-lg">
            <AlertTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No hay datos de trámites</h2>
            <p className="text-gray-500">No se pueden generar gráficos sin información de trámites registrados.</p>
            <p className="text-gray-500 mt-1">Por favor, registra algunos trámites para ver las visualizaciones.</p>
        </motion.div>
      )}

      {tramites.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card className="border-0 shadow-xl h-full bg-white">
                <CardHeader><CardTitle className="flex items-center text-gray-700"><ListChecks className="mr-2 h-5 w-5 text-teal-600" />Distribución por Estado</CardTitle></CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={estadosChartData} 
                        cx="50%" 
                        cy="50%" 
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={150} 
                        dataKey="value"
                      >
                        {estadosChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} (${((value / tramites.length) * 100).toFixed(1)}%)`, name]}/>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card className="border-0 shadow-xl h-full bg-white">
                <CardHeader><CardTitle className="flex items-center text-gray-700"><Brain className="mr-2 h-5 w-5 text-purple-600" />Distribución por Tipo de Trámite (Top 10)</CardTitle></CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tiposChartData.slice(0,10)} layout="vertical" margin={{ left: 180, right: 30, top: 5, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis dataKey="name" type="category" width={170} tick={{ fontSize: 10 }} interval={0} />
                      <Tooltip formatter={(value) => [value, "Cantidad"]}/>
                      <Legend />
                      <Bar dataKey="value" name="Cantidad" fill="#8b5cf6" barSize={15} radius={[0, 5, 5, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Card className="border-0 shadow-xl h-full bg-white">
                <CardHeader><CardTitle className="flex items-center text-gray-700"><AlertTriangleIcon className="mr-2 h-5 w-5 text-red-500" />Distribución por Prioridad</CardTitle></CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie 
                        data={prioridadChartData} 
                        cx="50%" 
                        cy="50%" 
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={150} 
                        dataKey="value"
                      >
                        {prioridadChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} (${((value / tramites.length) * 100).toFixed(1)}%)`, name]}/>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card className="border-0 shadow-xl h-full bg-white">
                <CardHeader><CardTitle className="flex items-center text-gray-700"><CalendarDays className="mr-2 h-5 w-5 text-blue-500" />Trámites Registrados por Mes</CardTitle></CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tramitesPorMesChart} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="trámites" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminGraficos;
