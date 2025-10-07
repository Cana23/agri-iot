import express from "express";
import cors from "cors";
import morgan from "morgan";
import ingestRoutes from "./routes/ingest.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", ingestRoutes);

export default app;
