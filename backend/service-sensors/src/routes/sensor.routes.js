const express = require('express');
const { getAllSensors, getByType } = require('../controllers/sensor.controller');

const router = express.Router();
const verifyToken = require('../middleware/auth');


router.get('/all',verifyToken, getAllSensors);
router.get('/:type',verifyToken, getByType);

module.exports = router;
