// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { sensorService } from '../services/sensorService';
import SensorCard from '../components/dashboard/SensorCard';
import { FaTemperatureHigh, FaTint, FaCloudRain, FaSun } from 'react-icons/fa';

const DashboardPage = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sensorService.getLatestSensorData();
        setSensorData(data);
      } catch (err) {
        setError('No se pudieron cargar los datos de los sensores.');
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Carga inicial
    const intervalId = setInterval(fetchData, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []);

  if (loading) return <p>Cargando datos en vivo...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard en Vivo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SensorCard 
          title="Temperatura" 
          value={sensorData?.temperature} 
          unit="°C" 
          icon={<FaTemperatureHigh className="text-red-500" />} 
        />
        <SensorCard 
          title="Humedad" 
          value={sensorData?.humidity} 
          unit="%" 
          icon={<FaTint className="text-blue-500" />} 
        />
        <SensorCard 
          title="Lluvia" 
          value={sensorData?.rain} 
          unit="mm" 
          icon={<FaCloudRain className="text-indigo-500" />} 
        />
        <SensorCard 
          title="Radiación Solar" 
          value={sensorData?.solarRadiation} 
          unit="W/m²" 
          icon={<FaSun className="text-yellow-500" />} 
        />
      </div>
    </div>
  );
};

export default DashboardPage;