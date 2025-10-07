import app from "./app.js";

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`✅ Service B (Sensores) corriendo en puerto ${PORT}`);
});
