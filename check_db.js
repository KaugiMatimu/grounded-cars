const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const total = await prisma.listing.count();
    const approved = await prisma.listing.count({ where: { approved: true } });
    const first = await prisma.listing.findFirst();
    console.log('--- DATABASE STATUS ---');
    console.log('Total Listings:', total);
    console.log('Approved Listings:', approved);
    console.log('Sample Listing:', JSON.stringify(first, null, 2));
    console.log('-----------------------');
  } catch (e) {
    console.error('Error fetching data:', e);
  } finally {
    process.exit(0);
  }
}
main();