/**
 * Database Seed Script
 * Run once after deployment to set up initial domains and admin user.
 * 
 * Usage:
 *   node scripts/seed.js
 *   docker exec tempmail-server node scripts/seed.js
 */

require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const Domain = require('./server/src/models/Domain');
const User = require('./server/src/models/User');

const seed = async () => {
  console.log('\n🌱 Seeding TempMail database...\n');

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  // ── 1. Create default disposable domains ─────────────────────────────────
  const defaultDomain = process.env.DEFAULT_DOMAIN || 'tempmailnova.com';

  const domains = [
    { name: defaultDomain, isDefault: true, isActive: true, isPremium: false },
  ];

  for (const d of domains) {
    await Domain.findOneAndUpdate(
      { name: d.name },
      d,
      { upsert: true, new: true }
    );
    console.log(`✅ Domain seeded: @${d.name}`);
  }

  // ── 2. Create admin user ──────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@tempmailnova.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePass123!';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'TempMail Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      plan: 'enterprise',
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
  }

  console.log('\n🎉 Database seeding complete!\n');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
