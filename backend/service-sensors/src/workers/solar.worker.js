import { parentPort } from "worker_threads";
import { generateSensorData } from "../utils/dataGenerator.js";

console.log("🟢 Solar Worker iniciado");

parentPort.on("message", async (intervalMs) => {
  console.log(`⏰ Solar Worker recibió intervalo: ${intervalMs}ms`);
  
  setInterval(() => {
    try {
      const value = generateSensorData("radiacion");
      const data = { type: "radiacion", value, timestamp: new Date() };
      
      console.log(`☀️  Solar Worker generó dato:`, data);
      parentPort.postMessage(data);
    } catch (error) {
      console.error("❌ Error en Solar Worker:", error);
    }
  }, intervalMs);
});