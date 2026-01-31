const bcrypt = require("bcrypt");
const User = require("../models/Users");

// Default admin credentials - can be overridden via environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@shopnow.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

/**
 * Seeds the database with a default admin user if one doesn't exist
 */
async function seedAdmin() {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      // Update role to Admin if it's not already
      if (existingAdmin.role !== "Admin") {
        existingAdmin.role = "Admin";
        await existingAdmin.save();
        console.log(`✅ Updated existing user ${ADMIN_EMAIL} to Admin role`);
      } else {
        console.log(`✅ Admin user already exists: ${ADMIN_EMAIL}`);
      }
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    const adminUser = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "Admin"
    });

    console.log(`✅ Admin user created successfully: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role: Admin`);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error.message);
  }
}

module.exports = { seedAdmin };
