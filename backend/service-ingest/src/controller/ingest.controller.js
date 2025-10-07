// src/controllers/ingest.controller.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const ingestData = async (req, res) => {
  try {
    const { sensorType, value, unit, timestamp, parcelId } = req.body;

    // Verificar si ya existe un registro igual (tipo + valor + timestamp)
    const existing = await prisma.sensorReading.findFirst({
      where: { sensorType, value, timestamp: new Date(timestamp) },
    });

    if (existing) {
      return res.status(200).json({ message: "Registro duplicado ignorado" });
    }

    const reading = await prisma.sensorReading.create({
      data: { sensorType, value, unit, timestamp: new Date(timestamp), parcelId },
    });

    res.status(201).json({ message: "Dato almacenado", reading });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al almacenar el dato" });
  }
};
