// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { FaChartLine, FaMapMarkerAlt, FaTrash } from 'react-icons/fa';

const Sidebar = () => {
  const linkClasses = "flex items-center px-4 py-2 mt-5 text-gray-100 hover:bg-green-700 transition-colors duration-200";
  const activeLinkClasses = "bg-green-700";

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-green-400">AgroTech</h1>
      </div>
      <nav className="flex-1 px-2 py-4">
        <NavLink to="/" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <RxDashboard className="h-6 w-6 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaChartLine className="h-6 w-6 mr-3" />
          Histórico
        </NavLink>
        <NavLink to="/plots" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaMapMarkerAlt className="h-6 w-6 mr-3" />
          Parcelas
        </NavLink>
         <NavLink to="/plots/deleted" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaTrash className="h-6 w-6 mr-3" />
          Eliminadas
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;