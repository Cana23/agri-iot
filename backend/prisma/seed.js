const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123', // Use hashed passwords in production!
        role: 'admin',
      },
      {
        username: 'user1',
        email: 'user1@example.com',
        password: 'user123',
        role: 'user',
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: 'user456',
        role: 'user',
      },
    ],
    skipDuplicates: true, // Avoid errors if run multiple times
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());