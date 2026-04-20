import { prisma } from '../db';

async function testConnection() {
  console.log('🔍 Testing AWS RDS Connection...');
  try {
    const phaseCount = await prisma.sdlcPhase.count();
    console.log(`✅ Connection successful! Found ${phaseCount} phases in the database.`);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
