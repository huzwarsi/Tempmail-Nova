const mongoose = require('mongoose');

// Disable Mongoose query buffering so API routes return clean error instead of hanging 10000ms
mongoose.set('bufferCommands', false);

const seedDefaultDomains = async () => {
  try {
    const Domain = require('../models/Domain');
    const defaultDomain = process.env.DEFAULT_DOMAIN || 'tempmailnova.com';

    // Ensure production domain exists and is set as active primary default
    const existingDefault = await Domain.findOne({ name: defaultDomain.toLowerCase() });
    if (!existingDefault) {
      await Domain.updateMany({}, { isDefault: false });
      await Domain.create({ name: defaultDomain.toLowerCase(), isDefault: true, isActive: true });
      console.log(`[Database Seed]: Successfully added & activated primary domain: ${defaultDomain}`);
    } else if (!existingDefault.isDefault || !existingDefault.isActive) {
      await Domain.updateMany({}, { isDefault: false });
      await Domain.updateOne({ name: defaultDomain.toLowerCase() }, { isDefault: true, isActive: true });
      console.log(`[Database Seed]: Ensured ${defaultDomain} is active default`);
    }
  } catch (err) {
    console.warn('[Database Seed Warning]:', err.message);
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tempmail';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    await seedDefaultDomains();
  } catch (error) {
    console.error(`\n⚠️ [MongoDB Cloud Connection Failed]: ${error.message}`);
    console.log(`ℹ️ [Reason]: MongoDB Atlas IP Whitelist error (Access denied from your current IP address).`);
    console.log(`👉 [How to Fix]: Go to https://cloud.mongodb.com -> Network Access -> Add IP -> Allow Access From Anywhere (0.0.0.0/0)\n`);

    // Attempting local fallback MongoDB connection
    try {
      const fallbackUri = 'mongodb://127.0.0.1:27017/tempmail';
      console.log(`🔄 [Attempting Local MongoDB Fallback]: ${fallbackUri}...`);
      const conn = await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 3000 });
      console.log(`✅ [Local MongoDB Connected]: ${conn.connection.host}`);
      await seedDefaultDomains();
    } catch (fallbackError) {
      console.error(`❌ [MongoDB Local Fallback Failed]: Local MongoDB service (127.0.0.1:27017) is not running.`);
    }
  }
};

module.exports = connectDB;
