// src/services/sensorService.js
import apiClient from './api';

// Obtiene los datos más recientes de todos los sensores para el dashboard en vivo
const getLatestSensorData = async () => {
  try {
    // La ruta '/sensors/latest' debería ser provista por tu backend
    const response = await apiClient.get('/sensors/latest');
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos de sensores:", error.response?.data || error.message);
    throw error;
  }
};

// Obtiene datos históricos para las gráficas (ej. temperatura en las últimas 24h)
const getHistoricalData = async (sensorType, timeRange) => {
  try {
    const response = await apiClient.get(`/sensors/history`, {
      params: {
        type: sensorType, // 'temperatura', 'humedad', etc.
        range: timeRange, // '24h', '7d', '30d'
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener historial de ${sensorType}:`, error.response?.data || error.message);
    throw error;
  }
};


export const sensorService = {
  getLatestSensorData,
  getHistoricalData,
};