import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import sensorRoutes from "./routes/sensor.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.use("/sensors", sensorRoutes);

export default app;