const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first'); // Forces IPv4 lookup
dns.setServers(['1.1.1.1', '8.8.8.8']); // Forces Cloudflare and Google DNS
require('dotenv').config();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: 'admin@akunzaphc.com' });
    if (existing) {
      console.log('Admin already exists');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Akunza123', salt);

    await User.create({
      fullName: 'System Administrator',
      email: 'admin@akunzaphc.com',
      password: hashedPassword,
      role: 'Admin'
    });

    console.log('Admin account created: admin@akunzaphc.com');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();