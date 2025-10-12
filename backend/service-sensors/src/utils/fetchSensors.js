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

      const operations = entries.map(entry => ({
        updateOne: {
          filter: { type, timestamp: entry.timestamp },
          update: { $setOnInsert: { type, ...entry } },
          upsert: true, // inserta si no existe
        },
      }));

      if (operations.length > 0) {
        const result = await Sensor.bulkWrite(operations, { ordered: false });
        console.log(
          `[✅] ${type}: ${result.upsertedCount} nuevos, ${result.matchedCount} existentes`
        );
      }
    }

    console.log('[✔] Finalizado almacenamiento de sensores');
  } catch (error) {
    console.error('[❌] Error al obtener o almacenar sensores:', error.message);
  }
}

module.exports = fetchAndStoreSensors;