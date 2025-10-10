// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { sensorService } from '../services/sensorService';
import SensorCard from '../components/dashboard/SensorCard';
import RecentHistoryChart from '../components/dashboard/RecentHistory';
import GoalGauge from '../components/dashboard/GoalGauge';
import StatusPanel from '../components/dashboard/StatusPanel';
import { FaTemperatureHigh, FaTint, FaCloudRain, FaSun } from 'react-icons/fa';

const DashboardPage = () => {
  const [liveData, setLiveData] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hacemos ambas peticiones en paralelo para mayor eficiencia
        const [live, history] = await Promise.all([
          sensorService.getLatestSensorData(),
          sensorService.getHistoricalData('temperature', '6h') // Asumimos que quieres ver las últimas 6h
        ]);
        setLiveData(live);
        setRecentHistory(history);
      } catch (err) {
        setError('No se pudieron cargar los datos del dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Carga inicial
    const intervalId = setInterval(fetchData, 10000); // Actualiza cada 10 segundos

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []);

  if (loading) return <p className="text-center text-gray-500">Cargando datos del dashboard...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Panel de Control Principal</h1>
        <p className="text-gray-500">Última actualización: {new Date().toLocaleTimeString()}</p>
      </div>

      {/* SECCIÓN 1: Datos en vivo (KPIs principales) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SensorCard title="Temperatura" value={liveData?.temperature} unit="°C" icon={<FaTemperatureHigh className="text-red-500"/>}/>
        <SensorCard title="Humedad" value={liveData?.humidity} unit="%" icon={<FaTint className="text-blue-500"/>}/>
        <SensorCard title="Precipitación" value={liveData?.rain} unit="mm" icon={<FaCloudRain className="text-indigo-500"/>}/>
        <SensorCard title="Radiación Solar" value={liveData?.solarRadiation} unit="W/m²" icon={<FaSun className="text-yellow-500"/>}/>
      </div>
      
      {/* SECCIÓN 2: Análisis y Estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna 1: Historial Reciente */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-4 text-gray-700">Tendencia de Temperatura (Últimas 6 horas)</h3>
          <RecentHistoryChart data={recentHistory} />
        </div>

        {/* Columna 2: Metas y Estado */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4 text-gray-700">Meta de Humedad</h3>
            <GoalGauge 
              value={liveData?.humidity} 
              goal={60} 
              unit="%"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
             <h3 className="font-bold text-lg mb-4 text-gray-700">Estado de la Parcela</h3>
            <StatusPanel data={liveData} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;