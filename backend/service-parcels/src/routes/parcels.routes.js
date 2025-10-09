const express = require('express');
const {
  getAllParcels,
  getDeletedParcels,
  createParcel,
  updateParcel,
  deleteParcel
} = require('../controllers/parcels.controller');
const { verifyToken, allowRoles } = require('../../../service-auth/src/middleware/auth.middleware'); // ajustar ruta si es otro repo
const router = express.Router();

router.use(verifyToken);

router.get('/', allowRoles(['user','admin']), getAllParcels);
router.get('/deleted', allowRoles(['user','admin']), getDeletedParcels);
router.post('/', allowRoles(['user','admin']), createParcel);
router.put('/:id', allowRoles(['user','admin']), updateParcel);
router.delete('/:id', allowRoles(['user','admin']), deleteParcel);

module.exports = router;
