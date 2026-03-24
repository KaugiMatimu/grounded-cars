const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Create database file if it doesn't exist
const dbPath = path.join(__dirname, 'prisma', 'dev.db');
if (!fs.existsSync(dbPath)) {
  console.log('Creating database file...');
  fs.writeFileSync(dbPath, '');
}

async function main() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Database connected successfully');

    const hashedPassword = await bcrypt.hash('password123', 12);

    console.log('Seeding regular test user...');
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        phone: '0712345678',
        location: 'Nairobi',
        role: 'USER'
      }
    });
    console.log('Test user ready:', testUser.email);

    console.log('Seeding admin user...');
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '0700000000',
        location: 'Admin Office',
        role: 'ADMIN'
      }
    });
    console.log('Admin user ready:', adminUser.email);

  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
