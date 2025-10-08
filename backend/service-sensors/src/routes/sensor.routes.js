const express = require('express');
const { getAllSensors, getByType } = require('../controllers/sensor.controller');
const router = express.Router();

router.get('/all', getAllSensors);
router.get('/:type', getByType); // temperatura, humedad, etc.

module.exports = router;
