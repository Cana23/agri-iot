// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importa tus páginas y componentes de layout
import LoginPage from '../src/pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import HistoryPage from '../pages/HistoryPage';
import PlotsPage from '../pages/PlotsPage';
import DeletedPlotsPage from '../pages/DeletedPlotsPage';
// Componente para proteger rutas
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // Si está autenticado, renderiza el layout principal con la página correspondiente
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet /> {/* Aquí se renderizará la página hija (Dashboard, Plots, etc.) */}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
          
<Route path="/" element={<DashboardPage />} />
<Route path="/history" element={<HistoryPage />} />
<Route path="/plots" element={<PlotsPage />} />
<Route path="/plots/deleted" element={<DeletedPlotsPage />} />

          </Route>

          {/* Redirección por defecto si ninguna ruta coincide */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;