// src/services/sensorService.js
import apiClient from './api';

// Obtiene los datos más recientes de todos los sensores para el dashboard en vivo
const getLatestSensorData = async () => {
  try {
    // 1. Hacemos la llamada a la API, que nos devolverá un array de sensores.
    // ej: [{type: 'radiacion_solar', value: 412.59}, {type: 'temperatura', value: 28.5}]
    const response = await apiClient.get('/sensors/latest');
    const sensorArray = response.data;

    // 2. Transformamos el array en el objeto que nuestros componentes necesitan.
    // Usamos 'reduce' para convertir el array en un objeto.
    const formattedData = sensorArray.reduce((acc, sensor) => {
      // Mapeamos el 'type' de la API a la clave que usa el frontend.
      const keyMap = {
        'temperatura': 'temperature',
        'humedad': 'humidity',
        'lluvia': 'rain',
        'radiacion_solar': 'solarRadiation'
      };

      // Obtenemos la clave correcta para el frontend (ej. 'radiacion_solar' -> 'solarRadiation')
      const frontendKey = keyMap[sensor.type];

      // Si encontramos una clave válida, la añadimos a nuestro nuevo objeto.
      if (frontendKey) {
        acc[frontendKey] = sensor.value;
      }
      
      return acc;
    }, {}); // El {} inicial es nuestro objeto vacío.

    // 3. Devolvemos el objeto ya formateado.
    // ej: { solarRadiation: 412.59, temperature: 28.5 }
    return formattedData;

  } catch (error) {
    console.error("Error al obtener datos de sensores:", error.response?.data || error.message);
    throw error;
  }
};

// ... (El resto del archivo, como getHistoricalData, no necesita cambios)
const getHistoricalData = async (sensorType, timeRange) => {
    // ...
};

export const sensorService = {
  getLatestSensorData,
  getHistoricalData,
};