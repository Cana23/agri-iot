const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllParcels = async (req, res) => {
  const { id: userId, role } = req.user;
  if (role === 'admin') {
    const parcels = await prisma.parcel.findMany();
    return res.json(parcels);
  }
  const parcels = await prisma.parcel.findMany({ where: { userId: Number(userId) } });
  return res.json(parcels);
};

exports.getDeletedParcels = async (req, res) => {
  const { id: userId, role } = req.user;
  if (role === 'admin') {
    const deleted = await prisma.parcel.findMany({ where: { activo: false } });
    return res.json(deleted);
  }
  const deleted = await prisma.parcel.findMany({ where: { activo: false, userId: Number(userId) } });
  return res.json(deleted);
};

exports.createParcel = async (req, res) => {
  const { id: userId, role } = req.user;
  const { nombre, ubicacion, cultivo, responsable, userId: bodyUserId } = req.body;

  const ownerId = role === 'admin' && bodyUserId ? Number(bodyUserId) : Number(userId);

  const newParcel = await prisma.parcel.create({
    data: { nombre, ubicacion, cultivo, responsable, userId: ownerId }
  });
  return res.status(201).json(newParcel);
};

exports.updateParcel = async (req, res) => {
  const { id: userId, role } = req.user;
  const { id } = req.params;
  const data = req.body;

  const parcel = await prisma.parcel.findUnique({ where: { id: Number(id) } });
  if (!parcel) return res.status(404).json({ error: 'Parcela no encontrada' });

  if (role !== 'admin' && parcel.userId !== Number(userId)) {
    return res.status(403).json({ error: 'No autorizado para actualizar esta parcela' });
  }

  const updated = await prisma.parcel.update({ where: { id: Number(id) }, data });
  return res.json(updated);
};

exports.deleteParcel = async (req, res) => {
  const { id: userId, role } = req.user;
  const { id } = req.params;

  const parcel = await prisma.parcel.findUnique({ where: { id: Number(id) } });
  if (!parcel) return res.status(404).json({ error: 'Parcela no encontrada' });

  if (role !== 'admin' && parcel.userId !== Number(userId)) {
    return res.status(403).json({ error: 'No autorizado para eliminar esta parcela' });
  }

  const deleted = await prisma.parcel.update({
    where: { id: Number(id) },
    data: { activo: false, deletedAt: new Date() }
  });

  return res.json(deleted);
};
