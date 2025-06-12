import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, FileText, Search, Settings, BarChartHorizontalBig } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 municipal-gradient rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">SIMUNI</span>
              <p className="text-xs text-gray-600">Sistema Municipal Inteligente</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'}
                className="flex items-center space-x-2"
              >
                <Building2 className="h-4 w-4" />
                <span>Inicio</span>
              </Button>
            </Link>
            
            <Link to="/solicitar">
              <Button 
                variant={isActive('/solicitar') ? 'default' : 'ghost'}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Solicitar Trámite</span>
              </Button>
            </Link>
            
            <Link to="/seguimiento">
              <Button 
                variant={isActive('/seguimiento') ? 'default' : 'ghost'}
                className="flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Seguimiento</span>
              </Button>
            </Link>

            <Link to="/estadisticas">
              <Button 
                variant={isActive('/estadisticas') ? 'default' : 'ghost'}
                className="flex items-center space-x-2"
              >
                <BarChartHorizontalBig className="h-4 w-4" />
                <span>Estadísticas</span>
              </Button>
            </Link>
            
            <Link to="/admin/login">
              <Button 
                variant={isActive('/admin/login') || location.pathname.startsWith('/admin/dashboard') ? 'default' : 'ghost'}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Administración</span>
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Building2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;