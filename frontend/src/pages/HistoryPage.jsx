// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { sensorService } from '../services/sensorService';
import TemperatureChart from '../components/dashboard/TemperatureChart';
import HumidityChart from '../components/dashboard/HumidityChart';
// Suponiendo que tienes un servicio para obtener la distribución de cultivos
// import { plotService } from '../services/plotService'; 

const HistoryPage = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [tempData, setTempData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  // const [cropData, setCropData] = useState([]);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const temp = await sensorService.getHistoricalData('temperature', timeRange);
        const humidity = await sensorService.getHistoricalData('humidity', timeRange);
        // const crops = await plotService.getCropDistribution(); // Necesitarías este endpoint
        setTempData(temp);
        setHumidityData(humidity);
        // setCropData(crops);
      } catch (error) {
        console.error("Error al cargar datos históricos:", error);
      }
    };
    loadChartData();
  }, [timeRange]); // Se vuelve a ejecutar cuando cambia el rango de tiempo

  const timeRanges = [
    { key: '24h', label: 'Últimas 24h' },
    { key: '7d', label: 'Últimos 7 días' },
    { key: '30d', label: 'Últimos 30 días' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Histórico de Sensores</h1>
        <div className="flex space-x-2 p-1 bg-gray-200 rounded-lg">
          {timeRanges.map(range => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${
                timeRange === range.key
                  ? 'bg-green-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-300'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-4">Temperatura ({timeRange})</h3>
          <TemperatureChart data={tempData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-4">Humedad ({timeRange})</h3>
          <HumidityChart data={humidityData} />
        </div>
        {/* Descomentar cuando tengas los datos de cultivos */}
        {/* <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-4">Distribución de Cultivos</h3>
          <CropDistributionChart data={cropData} />
        </div> */}
      </div>
    </div>
  );
};

export default HistoryPage;