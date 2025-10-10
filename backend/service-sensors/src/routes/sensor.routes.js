const express = require('express');
const { getAllSensors, getByType } = require('../controllers/sensor.controller');
const { verifyToken } = require('../../../service-auth/src/middleware/auth.middleware');
const router = express.Router();

router.use(verifyToken);

router.get('/all', getAllSensors);
router.get('/:type', getByType);

module.exports = router;
