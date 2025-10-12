const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  type: { type: String, required: true },
  value: Number,
  unit: String,
  timestamp: { type: Date, index: true },
  coords: {
    lat: Number,
    lon: Number
  }
});

sensorSchema.index({ type: 1, timestamp: -1 });


module.exports = mongoose.model('Sensor', sensorSchema);