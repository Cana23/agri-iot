const express = require('express');
const {
  getAllParcels,
  getDeletedParcels,
  createParcel,
  updateParcel,
  deleteParcel
} = require('../controllers/parcels.controller');

const router = express.Router();

router.get('/', getAllParcels);
router.get('/deleted', getDeletedParcels);
router.post('/', createParcel);
router.put('/:id', updateParcel);
router.delete('/:id', deleteParcel);

module.exports = router;
