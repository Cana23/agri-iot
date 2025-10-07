import express from "express";
import { ingestData } from "../controllers/ingest.controller.js";
import { validateSensorData } from "../middlewares/validateData.js";

const router = express.Router();

router.post("/ingest", validateSensorData, ingestData);

export default router;
