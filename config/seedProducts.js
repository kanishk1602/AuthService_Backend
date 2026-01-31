// Optional product seeder for initial migration from frontend defaults
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

async function seedFromFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(data)) throw new Error('Seeder file must contain an array');
  for (const item of data) {
    const exists = await Product.findOne({ name: item.name });
    if (!exists) {
      await Product.create(item);
    }
  }
}

module.exports = { seedFromFile };
