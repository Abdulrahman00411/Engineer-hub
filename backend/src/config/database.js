import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Connect to PostgreSQL via Prisma
const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log('PostgreSQL Connected via Prisma');
      return prisma;
    } catch (error) {
      console.error(`PostgreSQL connection attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        console.log(`Retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        throw error;
      }
    }
  }
};

// Graceful shutdown helper
const disconnectDB = async () => {
  await prisma.$disconnect();
};

// Check database connection status
const isConnected = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
};

// Get connection info
const getConnectionInfo = () => {
  return {
    state: 'connected',
    provider: 'postgresql',
    database: process.env.DATABASE_URL ? 'configured' : 'not configured'
  };
};

export { connectDB, disconnectDB, isConnected, getConnectionInfo, prisma };
export default connectDB;