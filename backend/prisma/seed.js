import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: 'hashed_password_aqui',
      role: 'admin',
    },
  });

  const parcels = await prisma.parcel.createMany({
    data: [
      {
        nombre: 'Parcela Norte',
        ubicacion: 'Coordenadas 19.43,-99.13',
        cultivo: 'Maíz',
        userId: user.id,
      },
      {
        name: 'Parcela Sur',
        location: 'Coordenadas 19.30,-99.20',
        cropType: 'Trigo',
        userId: user.id,
      },
      {
        name: 'Parcela Este',
        location: 'Coordenadas 19.50,-99.00',
        cropType: 'Soya',
        userId: user.id,
      },
    ],
  });

  console.log('✅ Seed completado con éxito');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
