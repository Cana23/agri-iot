import { parentPort } from "worker_threads";
import { generateSensorData } from "../utils/dataGenerator.js";

console.log("🟢 Rain Worker iniciado");

parentPort.on("message", async (intervalMs) => {
  console.log(`⏰ Rain Worker recibió intervalo: ${intervalMs}ms`);
  
  setInterval(() => {
    try {
      const value = generateSensorData("lluvia");
      const data = { type: "lluvia", value, timestamp: new Date() };
      
      console.log(`🌧️  Rain Worker generó dato:`, data);
      parentPort.postMessage(data);
    } catch (error) {
      console.error("❌ Error en Rain Worker:", error);
    }
  }, intervalMs);
});