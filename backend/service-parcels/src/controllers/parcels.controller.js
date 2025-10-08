const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllParcels = async (req, res) => {
  const parcels = await prisma.parcel.findMany({ where: { activo: true } });
  res.json(parcels);
};

exports.getDeletedParcels = async (req, res) => {
  const deleted = await prisma.parcel.findMany({ where: { activo: false } });
  res.json(deleted);
};

exports.createParcel = async (req, res) => {
  const { nombre, ubicacion, cultivo, responsable, userId } = req.body;
  const newParcel = await prisma.parcel.create({
    data: { nombre, ubicacion, cultivo, responsable, userId }
  });
  res.status(201).json(newParcel);
};

exports.updateParcel = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const updated = await prisma.parcel.update({ where: { id: parseInt(id) }, data });
  res.json(updated);
};

exports.deleteParcel = async (req, res) => {
  const { id } = req.params;
  const deleted = await prisma.parcel.update({
    where: { id: parseInt(id) },
    data: { activo: false, deletedAt: new Date() }
  });
  res.json(deleted);
};
