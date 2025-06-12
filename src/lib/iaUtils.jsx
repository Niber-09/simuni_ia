import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export const clasificarTramiteIA = (descripcion, tipoTramiteManual = null) => {
  const texto = descripcion.toLowerCase();
  let prioridadAsignada = 'baja';
  let tipoDetectado = 'Solicitud General';
  let areaAsignada = 'Mesa de Partes';
  let diasEstimados = '10-15 días';


  const categorias = {
    'Licencia de Construcción': {
      keywords: ['construcción', 'edificar', 'obra', 'construir', 'edificio', 'casa', 'ampliación', 'remodelación'],
      prioridad: 'alta',
      area: 'Desarrollo Urbano',
      dias: '15-20 días'
    },
    'Licencia de Funcionamiento': {
      keywords: ['negocio', 'comercio', 'tienda', 'empresa', 'funcionamiento', 'local', 'apertura'],
      prioridad: 'alta',
      area: 'Desarrollo Económico',
      dias: '10-15 días'
    },
    'Certificado de Residencia': {
      keywords: ['residencia', 'domicilio', 'vivir', 'certificado', 'constancia de vivencia'],
      prioridad: 'media',
      area: 'Registro Civil',
      dias: '5-7 días'
    },
    'Pago de Impuestos': {
      keywords: ['impuesto', 'predial', 'pago', 'tributo', 'deuda', 'arbitrios'],
      prioridad: 'media',
      area: 'Rentas',
      dias: '1-3 días'
    },
    'Reclamo de Servicios': {
      keywords: ['reclamo', 'queja', 'servicio', 'problema', 'agua', 'luz', 'basura', 'limpieza', 'parques'],
      prioridad: 'media',
      area: 'Servicios a la Ciudad',
      dias: '7-10 días'
    },
    'Solicitud de Poda de Árbol': {
      keywords: ['poda', 'árbol', 'talar', 'ramas', 'jardín'],
      prioridad: 'baja',
      area: 'Medio Ambiente',
      dias: '5-10 días'
    },
    'Permiso para Evento Público': {
      keywords: ['evento', 'feria', 'concierto', 'actividad pública', 'permiso'],
      prioridad: 'media',
      area: 'Seguridad Ciudadana',
      dias: '7-12 días'
    },
    'Constancia de Posesión': {
      keywords: ['posesión', 'terreno', 'propiedad', 'constancia'],
      prioridad: 'alta',
      area: 'Catastro',
      dias: '20-30 días'
    },
    'Otros': {
      keywords: [],
      prioridad: 'baja',
      area: 'Mesa de Partes',
      dias: '10-15 días'
    }
  };

  if (tipoTramiteManual && categorias[tipoTramiteManual]) {
    tipoDetectado = tipoTramiteManual;
    prioridadAsignada = categorias[tipoTramiteManual].prioridad;
    areaAsignada = categorias[tipoTramiteManual].area;
    diasEstimados = categorias[tipoTramiteManual].dias;
  } else {
    for (const [categoria, config] of Object.entries(categorias)) {
      if (config.keywords.some(keyword => texto.includes(keyword))) {
        tipoDetectado = categoria;
        prioridadAsignada = config.prioridad;
        areaAsignada = config.area;
        diasEstimados = config.dias;
        break; 
      }
    }
  }
  
  if (texto.includes("urgente") || texto.includes("inmediato")) {
     if (prioridadAsignada === 'baja') {
      prioridadAsignada = 'media';
      diasEstimados = categorias[tipoDetectado]?.prioridad === 'media' ? categorias[tipoDetectado].dias : '3-5 días'; 
    } else if (prioridadAsignada === 'media') {
      prioridadAsignada = 'alta';
      diasEstimados = categorias[tipoDetectado]?.prioridad === 'alta' ? categorias[tipoDetectado].dias : '4-6 días'; 
    }
  }


  return { tipo: tipoDetectado, prioridad: prioridadAsignada, area: areaAsignada, diasEstimados };
};

export const getPrioridadColor = (prioridad) => {
  switch (prioridad) {
    case 'alta': return 'bg-red-500 hover:bg-red-600';
    case 'media': return 'bg-blue-500 hover:bg-blue-600'; // Cambiado a azul
    case 'baja': return 'bg-green-500 hover:bg-green-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};

export const getPrioridadIcon = (prioridad) => {
  const icons = {
    alta: <AlertTriangle className="h-4 w-4" />,
    media: <Clock className="h-4 w-4" />, // Icono puede mantenerse o cambiarse si se desea
    baja: <CheckCircle className="h-4 w-4" />,
  };
  return icons[prioridad] || <Clock className="h-4 w-4" />;
};

export const estadosProgresoInfo = {
  'Recibido': { orden: 1, color: 'bg-sky-500', descripcion: 'Tu trámite ha sido recibido y registrado.' },
  'En Revisión': { orden: 2, color: 'bg-yellow-500', descripcion: 'Estamos revisando tu documentación.' },
  'En Proceso': { orden: 3, color: 'bg-orange-500', descripcion: 'Tu trámite está siendo procesado.' },
  'Observado': { orden: 2.5, color: 'bg-pink-500', descripcion: 'Se requiere información adicional o correcciones.' },
  'Aprobado': { orden: 4, color: 'bg-lime-500', descripcion: 'Tu trámite ha sido aprobado.' },
  'Rechazado': { orden: 4.5, color: 'bg-red-700', descripcion: 'Tu trámite ha sido rechazado.' },
  'Finalizado': { orden: 5, color: 'bg-emerald-600', descripcion: 'Trámite completado.' }
};

export const getEstadoColor = (estado) => {
  return (estadosProgresoInfo[estado] || {}).color || 'bg-gray-500';
};