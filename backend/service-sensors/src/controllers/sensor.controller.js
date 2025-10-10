const Sensor = require('../models/sensor.model');

exports.getAllSensors = async (req, res) => {
  const { id: userId, role } = req.user;
  const requestedUserId = req.query.userId ? Number(req.query.userId) : null;

  if (role !== 'admin') {
    if (!requestedUserId || requestedUserId !== Number(userId)) {
      return res.status(403).json({ error: 'No autorizado para ver estos sensores' });
    }
    const data = await Sensor.find({ userId: Number(userId) }).sort({ timestamp: -1 }).limit(1000);
    return res.json(data);
  }

  // admin puede ver todo o filtrar por userId
  const filter = requestedUserId ? { userId: requestedUserId } : {};
  const data = await Sensor.find(filter).sort({ timestamp: -1 }).limit(1000);
  return res.json(data);
};

exports.getByType = async (req, res) => {
  const { id: userId, role } = req.user;
  const { type } = req.params;
  const requestedUserId = req.query.userId ? Number(req.query.userId) : null;

  if (role !== 'admin') {
    if (!requestedUserId || requestedUserId !== Number(userId)) {
      return res.status(403).json({ error: 'No autorizado para ver estos sensores' });
    }
    const data = await Sensor.find({ type, userId: Number(userId) }).sort({ timestamp: -1 }).limit(1000);
    return res.json(data);
  }

  const filter = { type };
  if (requestedUserId) filter.userId = requestedUserId;
  const data = await Sensor.find(filter).sort({ timestamp: -1 }).limit(1000);
  return res.json(data);
};
