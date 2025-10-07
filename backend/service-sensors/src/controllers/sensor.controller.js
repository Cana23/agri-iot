import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const sensors = ["temp", "humidity", "rain", "solar"];
const workers = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const startSensors = async (req, res) => {
  console.log("🚀 Iniciando sensores...");
  
  try {
    const intervalMs = Number(req.query.interval) || 2000; // cada 2s por default
    const ingestUrl = process.env.INGEST_URL || "http://localhost:4002/ingest"; // destino

    console.log(`📊 Configuración: interval=${intervalMs}ms, ingestUrl=${ingestUrl}`);

    // Verificar que los archivos de workers existan
    sensors.forEach((sensor) => {
      const workerPath = path.resolve(__dirname, `../workers/${sensor}.worker.js`);
      console.log(`🔍 Buscando worker: ${workerPath}`);
    });

    // Crear un worker por tipo de sensor
    sensors.forEach((sensor) => {
      try {
        const workerPath = path.resolve(__dirname, `../workers/${sensor}.worker.js`);
        console.log(`Creando worker para: ${sensor} en ${workerPath}`);
        
        const worker = new Worker(workerPath);
        workers.push(worker);

        console.log(`✅ Worker ${sensor} creado exitosamente`);

        worker.postMessage(intervalMs);
        console.log(`Mensaje enviado a worker ${sensor}: ${intervalMs}ms`);

        worker.on("message", async (data) => {
          try {
            console.log(`Dato recibido de ${sensor}:`, data);
            
            // Validar datos antes de enviar
            if (!data || !data.type || data.value === undefined) {
              console.warn(`⚠️  Dato inválido de ${sensor}:`, data);
              return;
            }

            // Enviar datos al servicio de ingesta
            console.log(`Enviando ${data.type}=${data.value} a ${ingestUrl}`);
            const response = await axios.post(ingestUrl, data, {
              timeout: 5000,
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            console.log(`✅ Enviado exitoso: ${data.type}=${data.value} (Status: ${response.status})`);
          } catch (err) {
            console.error(`❌ Error al enviar dato de ${sensor}:`, {
              message: err.message,
              code: err.code,
              url: ingestUrl,
              data: data
            });
            
            if (err.response) {
              console.error(`Response error: ${err.response.status} - ${err.response.statusText}`);
            }
          }
        });

        worker.on("error", (error) => {
          console.error(`Error en worker ${sensor}:`, {
            message: error.message,
            stack: error.stack,
            code: error.code
          });
        });

        worker.on("exit", (code) => {
          if (code !== 0) {
            console.error(`Worker ${sensor} terminó con código:`, code);
          } else {
            console.log(`Worker ${sensor} terminó exitosamente`);
          }
        });

        worker.on("online", () => {
          console.log(`Worker ${sensor} está online`);
        });

      } catch (workerError) {
        console.error(`Error crítico al crear worker ${sensor}:`, {
          message: workerError.message,
          stack: workerError.stack,
          sensor: sensor
        });
      }
    });

    console.log(`Todos los workers iniciados. Sensores activos: ${sensors.join(', ')}`);
    res.json({ 
      message: "Sensores iniciados correctamente", 
      interval: intervalMs,
      activeSensors: sensors 
    });

  } catch (error) {
    console.error("Error fatal al iniciar sensores:", {
      message: error.message,
      stack: error.stack,
      query: req.query,
      env: { INGEST_URL: process.env.INGEST_URL }
    });
    
    res.status(500).json({ 
      error: "Error al iniciar sensores",
      details: error.message 
    });
  }
};

// Funcion para detener todos los workers
export const stopSensors = async (req, res) => {
  console.log("Deteniendo todos los sensores...");
  
  let stoppedCount = 0;
  workers.forEach((worker, index) => {
    try {
      worker.terminate();
      stoppedCount++;
      console.log(`Worker ${sensors[index]} terminado`);
    } catch (error) {
      console.error(`Error terminando worker ${sensors[index]}:`, error.message);
    }
  });

  workers.length = 0;
  
  res.json({ 
    message: "Sensores detenidos", 
    stopped: stoppedCount,
    total: sensors.length 
  });
};

export const getSensorsStatus = async (req, res) => {
  const status = workers.map((worker, index) => ({
    sensor: sensors[index],
    active: !worker.threadId ? 'terminated' : 'active',
    threadId: worker.threadId
  }));
  
  res.json({ 
    status: "Estado de sensores",
    sensors: status,
    total: workers.length
  });
};