import { parentPort } from "worker_threads";
import { generateSensorData } from "../utils/dataGenerator.js";

console.log("🟢 Humidity Worker iniciado");

parentPort.on("message", async (intervalMs) => {
  console.log(`⏰ Humidity Worker recibió intervalo: ${intervalMs}ms`);
  
  setInterval(() => {
    try {
      const value = generateSensorData("humedad");
      const data = { type: "humedad", value, timestamp: new Date() };
      
      console.log(`💧 Humidity Worker generó dato:`, data);
      parentPort.postMessage(data);
    } catch (error) {
      console.error("❌ Error en Humidity Worker:", error);
    }
  }, intervalMs);
});