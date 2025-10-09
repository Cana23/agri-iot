// src/components/layout/Navbar.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white shadow-md flex items-center justify-end px-6">
      <div className="flex items-center">
        <span className="text-gray-600 mr-4">Hola, {user?.name || 'Usuario'}</span>
        <button 
          onClick={handleLogout} 
          className="flex items-center text-red-500 hover:text-red-700 transition-colors duration-200"
          title="Cerrar sesión"
        >
          <FiLogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;