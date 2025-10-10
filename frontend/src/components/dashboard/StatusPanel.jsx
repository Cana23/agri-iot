// src/components/dashboard/StatusPanel.jsx
import React from 'react';
import { FaArrowUp, FaArrowDown, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const StatusItem = ({ icon, text, value, color }) => (
  <div className="flex items-center justify-between p-2 rounded-md">
    <div className="flex items-center">
      <div className={`mr-3 text-lg ${color}`}>{icon}</div>
      <span className="text-gray-600">{text}</span>
    </div>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

const StatusPanel = ({ data }) => {
  const getTemperatureStatus = () => {
    if (!data || data.temperature === undefined) return { text: 'Sin datos', icon: <FaExclamationTriangle />, color: 'text-gray-400' };
    if (data.temperature > 32) return { text: 'Alta', icon: <FaArrowUp />, color: 'text-red-500' };
    if (data.temperature < 15) return { text: 'Baja', icon: <FaArrowDown />, color: 'text-blue-500' };
    return { text: 'Óptima', icon: <FaCheckCircle />, color: 'text-green-500' };
  };

  const getHumidityStatus = () => {
    if (!data || data.humidity === undefined) return { text: 'Sin datos', icon: <FaExclamationTriangle />, color: 'text-gray-400' };
    if (data.humidity > 70) return { text: 'Alta', icon: <FaArrowUp />, color: 'text-blue-600' };
    if (data.humidity < 40) return { text: 'Baja', icon: <FaArrowDown />, color: 'text-yellow-600' };
    return { text: 'Óptima', icon: <FaCheckCircle />, color: 'text-green-500' };
  };
  
  const tempStatus = getTemperatureStatus();
  const humidityStatus = getHumidityStatus();

  return (
    <div className="space-y-3">
      <StatusItem icon={tempStatus.icon} text="Temperatura" value={tempStatus.text} color={tempStatus.color} />
      <StatusItem icon={humidityStatus.icon} text="Humedad" value={humidityStatus.text} color={humidityStatus.color} />
       <StatusItem icon={<FaCheckCircle/>} text="Riego" value="Automático" color="text-gray-500" />
    </div>
  );
};

export default StatusPanel;