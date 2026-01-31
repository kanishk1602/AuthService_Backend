const dbConnect = require('./config/database');
const { seedAdmin } = require('./config/seedAdmin');
const { seedFromFile } = require('./config/seedProducts');
const path = require('path');

async function run() {
  try {
    await dbConnect.connect();
    console.log('Connected. Seeding...');
    await seedAdmin();
    // Seed products from defaultProducts.json
    await seedFromFile(path.join(__dirname, 'config', 'defaultProducts.json'));
    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();
