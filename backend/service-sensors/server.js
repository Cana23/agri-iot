require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const cron = require('node-cron');
const fetchAndStoreSensors = require('./src/utils/fetchSensors');
const sensorRoutes = require('./src/routes/sensor.routes');
const fs = require('fs');
const path = require('path');

const rfs = fs.createWriteStream(path.join(__dirname, '..', 'logs', 'service-sensors.log'), { flags: 'a' });

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: rfs }));

app.use('/api/sensors', sensorRoutes);
app.get('/health', (req, res) => res.status(200).send('OK'));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('[✔] Conectado a MongoDB');
  cron.schedule('*/5 * * * *', fetchAndStoreSensors); // cada 5 minutos
}).catch(err => console.error('[✖] Error MongoDB:', err));

const PORT = process.env.SENSOR_PORT || 3002;
app.listen(PORT, () => console.log(`Sensor service running on port ${PORT}`));
