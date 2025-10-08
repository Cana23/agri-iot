const Sensor = require('../models/sensor.model');

exports.getAllSensors = async (req, res) => {
  const data = await Sensor.find().limit(1000).sort({ timestamp: -1 });
  res.json(data);
};

exports.getByType = async (req, res) => {
  const { type } = req.params;
  const data = await Sensor.find({ type }).limit(1000).sort({ timestamp: -1 });
  res.json(data);
};
