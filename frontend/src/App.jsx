// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importa tus páginas y componentes de layout
import LoginPage from '../src/pages/LoginPage';
import DashboardPage from '../src/pages/DashboardPage';
import Sidebar from '../src/components/layout/Sidebar';
import Navbar from '../src/components/layout/Navbar';
import HistoryPage from '../src/pages/HistoryPage';
import PlotsPage from '../src/pages/PlotsPage';
import DeletedPlotsPage from '../src/pages/DeletePlotsPage';
// Componente para proteger rutas


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas Protegidas */}
          <Route element=''>
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