export const validateSensorData = (req, res, next) => {
  const { sensorType, value, unit, timestamp } = req.body;

  if (!sensorType || typeof value !== "number" || !unit) {
    return res.status(400).json({ error: "Datos de sensor inválidos" });
  }

  next();
};