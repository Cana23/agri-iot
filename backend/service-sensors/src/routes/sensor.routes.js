import express from "express";
import { startSensors } from "../controllers/sensor.controller.js";

const router = express.Router();

// Endpoint para iniciar los sensores
router.get("/start", startSensors);

export default router;
