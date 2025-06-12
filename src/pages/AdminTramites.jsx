
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  FileText, Clock, CheckCircle, AlertTriangle, Search, Filter, Download, RefreshCw, Eye, XCircle, Check, CalendarDays
} from 'lucide-react';
import { getPrioridadColor, getPrioridadIcon, getEstadoColor, estadosProgresoInfo } from '@/lib/iaUtils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminTramites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tramites, setTramites] = useState([]);
  const [filteredTramites, setFilteredTramites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterPrioridad, setFilterPrioridad] = useState('todos');
  const [filterFechaDesde, setFilterFechaDesde] = useState('');
  const [filterFechaHasta, setFilterFechaHasta] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTramite, setSelectedTramite] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoEstadoComentario, setNuevoEstadoComentario] = useState('');

  useEffect(() => {
    loadTramites();
  }, []);

  useEffect(() => {
    filterAndSortTramites();
  }, [tramites, searchTerm, filterEstado, filterPrioridad, filterFechaDesde, filterFechaHasta]);

  const loadTramites = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const tramitesData = JSON.parse(localStorage.getItem('tramites') || '[]');
      setTramites(tramitesData.map(t => ({...t, historialEstados: t.historialEstados || [{ estado: t.estado, fecha: t.fechaCreacion, comentario: 'Trámite inicializado.'}]})));
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los trámites", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortTramites = () => {
    let filtered = [...tramites];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        (t.codigo && t.codigo.toLowerCase().includes(term)) ||
        (t.nombreCompleto && t.nombreCompleto.toLowerCase().includes(term)) ||
        (t.dni && t.dni.includes(term)) ||
        (t.tipo && t.tipo.toLowerCase().includes(term)) ||
        (t.tipoTramite && t.tipoTramite.toLowerCase().includes(term))
      );
    }

    if (filterEstado !== 'todos') {
      filtered = filtered.filter(t => t.estado === filterEstado);
    }
    if (filterPrioridad !== 'todos') {
      filtered = filtered.filter(t => t.prioridad === filterPrioridad);
    }
    if (filterFechaDesde) {
      filtered = filtered.filter(t => new Date(t.fechaCreacion) >= new Date(filterFechaDesde));
    }
    if (filterFechaHasta) {
      filtered = filtered.filter(t => new Date(t.fechaCreacion) <= new Date(filterFechaHasta));
    }
    
    filtered.sort((a,b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
    setFilteredTramites(filtered);
  };

  const updateTramiteEstadoAdmin = (tramiteId, nuevoEstado, comentario) => {
    if (!comentario.trim() && nuevoEstado !== 'Recibido' && nuevoEstado !== 'En Proceso' && nuevoEstado !== 'Aprobado' && nuevoEstado !== 'Finalizado' && nuevoEstado !== 'Rechazado' && nuevoEstado !== 'Observado') {
       toast({ title: "Comentario Requerido", description: "Por favor, añade un comentario para el cambio de estado.", variant: "destructive"});
       return;
    }
    
    let comentarioFinal = comentario.trim();
    if (!comentarioFinal) {
        switch(nuevoEstado) {
            case 'Recibido': comentarioFinal = 'Trámite recibido y registrado.'; break;
            case 'En Proceso': comentarioFinal = 'El trámite ha pasado a estado "En Proceso".'; break;
            case 'Aprobado': comentarioFinal = 'El trámite ha sido aprobado.'; break;
            case 'Finalizado': comentarioFinal = 'El trámite ha sido finalizado exitosamente.'; break;
            case 'Rechazado': comentarioFinal = 'El trámite ha sido rechazado.'; break;
            case 'Observado': comentarioFinal = 'El trámite ha sido observado, se requieren correcciones o información adicional.'; break;
            default: comentarioFinal = 'Estado actualizado.';
        }
    }


    const tramitesActualizados = tramites.map(tramite => {
      if (tramite.id === tramiteId) {
        const nuevoHistorial = [...(tramite.historialEstados || []), { estado: nuevoEstado, fecha: new Date().toISOString(), comentario: comentarioFinal }];
        return {
          ...tramite,
          estado: nuevoEstado,
          fechaActualizacion: new Date().toISOString(),
          historialEstados: nuevoHistorial
        };
      }
      return tramite;
    });

    setTramites(tramitesActualizados);
    localStorage.setItem('tramites', JSON.stringify(tramitesActualizados));
    
    if(selectedTramite && selectedTramite.id === tramiteId) {
      setSelectedTramite(prev => ({...prev, estado: nuevoEstado, fechaActualizacion: new Date().toISOString(), historialEstados: [...(prev.historialEstados || []), { estado: nuevoEstado, fecha: new Date().toISOString(), comentario: comentarioFinal }]}));
    }
    setNuevoEstadoComentario('');
    toast({ title: "Estado Actualizado", description: `El trámite ${selectedTramite?.codigo} ha sido marcado como: ${nuevoEstado}` });
  };

  const openModalDetalle = (tramite) => {
    setSelectedTramite(tramite);
    setNuevoEstadoComentario('');
    setIsModalOpen(true);
  };

  const exportarPDF = () => {
    if (filteredTramites.length === 0) {
      toast({ title: "Sin datos", description: "No hay trámites para exportar.", variant: "destructive" });
      return;
    }

    const doc = new jsPDF();
    doc.text("Lista de Trámites - SIMUNI", 14, 16);
    doc.setFontSize(10);
    doc.text(`Fecha de exportación: ${new Date().toLocaleDateString('es-PE')}`, 14, 22);

    const tableColumn = ["Código", "Solicitante", "DNI", "Tipo Trámite", "Prioridad", "Estado", "Fecha Creación"];
    const tableRows = [];

    filteredTramites.forEach(tramite => {
      const tramiteData = [
        tramite.codigo,
        tramite.nombreCompleto,
        tramite.dni,
        tramite.tipoTramite,
        tramite.prioridad,
        tramite.estado,
        new Date(tramite.fechaCreacion).toLocaleDateString('es-PE'),
      ];
      tableRows.push(tramiteData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 25 }, 
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 30 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 25 },
      }
    });
    doc.save(`tramites_simuni_${new Date().toISOString().slice(0,10)}.pdf`);
    toast({ title: "Exportación Exitosa", description: "La lista de trámites se ha exportado a PDF." });
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <RefreshCw className="h-12 w-12 animate-spin text-blue-600" /> <p className="ml-3 text-lg">Cargando trámites...</p>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-8">
          <FileText className="mr-3 h-8 w-8 text-blue-600" /> Gestión de Trámites
        </h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="border-0 shadow-lg mb-8 bg-white">
          <CardHeader><CardTitle className="flex items-center text-gray-700"><Filter className="mr-2 h-5 w-5 text-gray-500" />Filtros y Búsqueda</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-1"><Label htmlFor="search" className="text-sm font-medium text-gray-700">Buscar</Label><Input id="search" placeholder="Código, DNI, nombre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-gray-50"/></div>
              <div className="space-y-1"><Label htmlFor="filterEstado" className="text-sm font-medium text-gray-700">Estado</Label><select id="filterEstado" value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-gray-50"><option value="todos">Todos</option>{Object.keys(estadosProgresoInfo).map(e => <option key={e} value={e}>{e}</option>)}</select></div>
              <div className="space-y-1"><Label htmlFor="filterPrioridad" className="text-sm font-medium text-gray-700">Prioridad</Label><select id="filterPrioridad" value={filterPrioridad} onChange={e => setFilterPrioridad(e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-gray-50"><option value="todos">Todas</option><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select></div>
              <div className="space-y-1"><Label htmlFor="filterFechaDesde" className="text-sm font-medium text-gray-700">Desde</Label><Input id="filterFechaDesde" type="date" value={filterFechaDesde} onChange={e => setFilterFechaDesde(e.target.value)} className="bg-gray-50"/></div>
              <div className="space-y-1"><Label htmlFor="filterFechaHasta" className="text-sm font-medium text-gray-700">Hasta</Label><Input id="filterFechaHasta" type="date" value={filterFechaHasta} onChange={e => setFilterFechaHasta(e.target.value)} className="bg-gray-50"/></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-700">
              <span className="flex items-center"><FileText className="mr-2 h-5 w-5 text-blue-600" />Lista de Trámites ({filteredTramites.length})</span>
              <Button onClick={exportarPDF} variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Exportar PDF</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTramites.length === 0 ? (
              <div className="text-center py-12"><FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-700">No se encontraron trámites</h3><p className="text-gray-500">Ajusta los filtros o no hay trámites registrados.</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-3">Código</th><th scope="col" className="px-4 py-3">Solicitante</th><th scope="col" className="px-4 py-3">Tipo (IA)</th><th scope="col" className="px-4 py-3">Prioridad</th><th scope="col" className="px-4 py-3">Estado</th><th scope="col" className="px-4 py-3">Fecha</th><th scope="col" className="px-4 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTramites.map(t => (
                      <tr key={t.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 font-medium text-gray-800">{t.codigo}</td>
                        <td className="px-4 py-2 text-gray-600">{t.nombreCompleto} ({t.dni})</td>
                        <td className="px-4 py-2 text-gray-600">{t.tipo}</td>
                        <td className="px-4 py-2"><Badge className={`${getPrioridadColor(t.prioridad)} text-white capitalize text-xs`}>{getPrioridadIcon(t.prioridad)} {t.prioridad}</Badge></td>
                        <td className="px-4 py-2"><Badge className={`${getEstadoColor(t.estado)} text-white text-xs`}>{t.estado}</Badge></td>
                        <td className="px-4 py-2 text-gray-600">{new Date(t.fechaCreacion).toLocaleDateString('es-PE')}</td>
                        <td className="px-4 py-2"><Button variant="outline" size="sm" onClick={() => openModalDetalle(t)}><Eye className="h-4 w-4 mr-1" /> Ver</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {selectedTramite && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-2xl flex items-center text-gray-800">
                <FileText className="mr-2 h-6 w-6 text-blue-600" /> Detalle del Trámite: {selectedTramite.codigo}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                ID: {selectedTramite.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-gray-50">
                  <CardHeader><CardTitle className="text-lg text-gray-700">Información del Solicitante</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <p><strong className="w-28 inline-block font-medium text-gray-800">Nombre:</strong> {selectedTramite.nombreCompleto}</p>
                    <p><strong className="w-28 inline-block font-medium text-gray-800">DNI:</strong> {selectedTramite.dni}</p>
                    <p><strong className="w-28 inline-block font-medium text-gray-800">Email:</strong> {selectedTramite.email || 'No provisto'}</p>
                    <p><strong className="w-28 inline-block font-medium text-gray-800">Distrito:</strong> {selectedTramite.distrito}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50">
                  <CardHeader><CardTitle className="text-lg text-gray-700">Detalles del Trámite</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <p><strong className="w-28 inline-block font-medium text-gray-800">Tipo (Form):</strong> {selectedTramite.tipoTramite}</p>
                    <p><strong className="w-28 inline-block font-medium text-gray-800">Clasif. IA:</strong> {selectedTramite.tipo}</p>
                    <p><strong className="w-28 inline-block font-medium text-gray-800">Prioridad IA:</strong> <Badge className={`${getPrioridadColor(selectedTramite.prioridad)} text-white capitalize text-xs`}>{getPrioridadIcon(selectedTramite.prioridad)} {selectedTramite.prioridad}</Badge></p>
                    <p><strong className="w-28 inline-block font-medium text-gray-800">Área Asignada:</strong> {selectedTramite.areaAsignada || 'N/A'}</p>
                    <p><strong className="w-28 inline-block font-medium text-gray-800">Creado:</strong> {new Date(selectedTramite.fechaCreacion).toLocaleString('es-PE', {dateStyle:'short', timeStyle:'short'})}</p>
                    <p><strong className="w-28 inline-block font-medium text-gray-800">Actualizado:</strong> {new Date(selectedTramite.fechaActualizacion).toLocaleString('es-PE', {dateStyle:'short', timeStyle:'short'})}</p>
                    <p><strong className="w-28 inline-block font-medium text-gray-800">Estado Actual:</strong> <Badge className={`${getEstadoColor(selectedTramite.estado)} text-white text-xs`}>{selectedTramite.estado}</Badge></p>
                    <div><strong className="block mb-1 font-medium text-gray-800">Descripción:</strong><p className="p-2 bg-white rounded border text-xs">{selectedTramite.descripcion}</p></div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-gray-50">
                  <CardHeader><CardTitle className="text-lg text-gray-700">Cambiar Estado</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea placeholder="Comentario sobre el cambio de estado (opcional para algunos estados)..." value={nuevoEstadoComentario} onChange={(e) => setNuevoEstadoComentario(e.target.value)} rows={3} className="bg-white"/>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => updateTramiteEstadoAdmin(selectedTramite.id, 'En Proceso', nuevoEstadoComentario)}><Clock className="mr-1 h-4 w-4"/>En Proceso</Button>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => updateTramiteEstadoAdmin(selectedTramite.id, 'Aprobado', nuevoEstadoComentario)}><Check className="mr-1 h-4 w-4"/>Aprobado</Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => updateTramiteEstadoAdmin(selectedTramite.id, 'Finalizado', nuevoEstadoComentario)}><CheckCircle className="mr-1 h-4 w-4"/>Finalizado</Button>
                      <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => updateTramiteEstadoAdmin(selectedTramite.id, 'Rechazado', nuevoEstadoComentario)}><XCircle className="mr-1 h-4 w-4"/>Rechazado</Button>
                      <Button size="sm" variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50" onClick={() => updateTramiteEstadoAdmin(selectedTramite.id, 'Observado', nuevoEstadoComentario)}><AlertTriangle className="mr-1 h-4 w-4"/>Observado</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50">
                  <CardHeader><CardTitle className="text-lg text-gray-700">Historial de Estados</CardTitle></CardHeader>
                  <CardContent className="max-h-60 overflow-y-auto space-y-3">
                    {selectedTramite.historialEstados?.slice().reverse().map((h, i) => (
                      <div key={i} className="text-xs p-3 border-l-4 border-blue-500 bg-white rounded-r shadow-sm">
                        <p className="font-semibold text-blue-700">{h.estado} - <span className="font-normal text-gray-500">{new Date(h.fecha).toLocaleString('es-PE', {dateStyle:'medium', timeStyle:'short'})}</span></p>
                        <p className="text-gray-600 italic mt-1">"{h.comentario || 'Sin comentario.'}"</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
            <DialogFooter className="pt-4 border-t">
              <DialogClose asChild><Button variant="outline">Cerrar</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminTramites;
