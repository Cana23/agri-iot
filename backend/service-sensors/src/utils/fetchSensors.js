const axios = require('axios');
const Sensor = require('../models/sensor.model');

const SENSOR_API = process.env.SENSOR_API;

async function fetchAndStoreSensors() {
  console.log('[⏳] Iniciando fetch de sensores...');

  try {
    const { data } = await axios.get(SENSOR_API);
    console.log('[📡] Datos recibidos de la API externa');

    const types = Object.keys(data);
    console.log(`[📊] Tipos de sensores detectados: ${types.join(', ')}`);

    for (const type of types) {
      const entries = data[type];
      console.log(`[🔁] Procesando ${entries.length} registros de tipo "${type}"`);

      const tasks = entries.map(async entry => {
        try {
          const exists = await Sensor.exists({ type, timestamp: entry.timestamp });
          if (!exists) {
            await Sensor.create({ type, ...entry });
            console.log(`[✅] Guardado: ${type} @ ${entry.timestamp}`);
          } else {
            console.log(`[🟡] Duplicado ignorado: ${type} @ ${entry.timestamp}`);
          }
        } catch (err) {
          console.error(`[❌] Error al guardar ${type} @ ${entry.timestamp}:`, err.message);
        }
      });

      await Promise.allSettled(tasks);
    }

    console.log('[✔] Finalizado almacenamiento de sensores');
  } catch (error) {
    console.error('[❌] Error al obtener sensores:', error.message);
  }
}

module.exports = fetchAndStoreSensors;