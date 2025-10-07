import { parentPort } from "worker_threads";
import { generateSensorData } from "../utils/dataGenerator.js";

console.log("🟢 Temp Worker iniciado");

parentPort.on("message", async (intervalMs) => {
  console.log(`⏰ Temp Worker recibió intervalo: ${intervalMs}ms`);
  
  setInterval(() => {
    try {
      // Usa "temperatura" en lugar de "temp"
      const value = generateSensorData("temperatura");
      const data = { type: "temperatura", value, timestamp: new Date() };
      
      console.log(`🌡️  Temp Worker generó dato:`, data);
      parentPort.postMessage(data);
    } catch (error) {
      console.error("❌ Error en Temp Worker:", error);
    }
  }, intervalMs);
});