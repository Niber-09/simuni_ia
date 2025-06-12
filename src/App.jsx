
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/pages/LandingPage';
import SolicitarTramite from '@/pages/SolicitarTramite';
import SeguimientoTramite from '@/pages/SeguimientoTramite';
import EstadisticasPublicas from '@/pages/EstadisticasPublicas';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminTramites from '@/pages/AdminTramites';
import AdminGraficos from '@/pages/AdminGraficos';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const PublicLayout = ({ children }) => (
  <Layout type="public">{children}</Layout>
);

const AdminLayout = ({ children }) => (
  <Layout type="admin">{children}</Layout>
);


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <Routes>
            <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
            <Route path="/solicitar" element={<PublicLayout><SolicitarTramite /></PublicLayout>} />
            <Route path="/seguimiento" element={<PublicLayout><SeguimientoTramite /></PublicLayout>} />
            <Route path="/estadisticas" element={<PublicLayout><EstadisticasPublicas /></PublicLayout>} />
            
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/admin/tramites" 
              element={
                <ProtectedRoute>
                  <AdminLayout><AdminTramites /></AdminLayout>
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/admin/graficos" 
              element={
                <ProtectedRoute>
                  <AdminLayout><AdminGraficos /></AdminLayout>
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
