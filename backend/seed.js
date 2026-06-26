import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@engineer.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@engineer.com',
      password: hashedPassword,
      role: 'admin',
      avatar: { initials: 'AD', bg: 'rgba(239,68,68,0.2)', color: '#EF4444' },
      badge: 'Admin',
      badgeType: 'red',
    },
  });

  console.log('Admin user created:', admin.email);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());