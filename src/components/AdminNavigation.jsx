
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, LayoutDashboard, LogOut, Settings, BarChart3, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const AdminNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    navigate('/admin/login');
  };

  const navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { path: '/admin/tramites', label: 'Trámites', icon: <FileText className="h-4 w-4" /> },
    { path: '/admin/graficos', label: 'Gráficos', icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <nav className="bg-gray-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">SIMUNI Admin</span>
              <p className="text-xs text-gray-300">Panel de Control Inteligente</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}>
                <Button 
                  variant={isActive(link.path) ? 'secondary' : 'ghost'}
                  className={`flex items-center space-x-2 text-white hover:bg-gray-700 ${isActive(link.path) ? 'bg-gray-700' : ''}`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Button>
              </Link>
            ))}
            <Button 
              variant='ghost'
              className="flex items-center space-x-2 text-white hover:bg-gray-700"
              onClick={() => toast({ title: "🚧 Próximamente", description: "La configuración estará disponible pronto."})}
            >
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </Button>
          </div>

          <div className="flex items-center">
            <Button 
              onClick={handleLogout}
              variant="ghost"
              className="flex items-center space-x-2 text-red-400 hover:bg-red-700 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
            <div className="md:hidden ml-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" onClick={() => toast({description: "Menú móvil en desarrollo"})}>
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
