const express = require('express');
const {
  getAllParcels,
  getDeletedParcels,
  createParcel,
  updateParcel,
  deleteParcel
} = require('../controllers/parcels.controller');
const verifyToken= require('../middleware/auth.middleware'); // ajustar ruta si es otro repo
const router = express.Router();



router.get('/', verifyToken, getAllParcels);
router.get('/deleted', verifyToken, getDeletedParcels);
router.post('/', verifyToken, createParcel);
router.put('/:id', verifyToken, updateParcel);
router.delete('/:id', verifyToken, deleteParcel);

module.exports = router;
