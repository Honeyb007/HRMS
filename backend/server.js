const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first'); // Forces IPv4 lookup
dns.setServers(['1.1.1.1', '8.8.8.8']); // Forces Cloudflare and Google DNS

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));

app.get('/', (req, res) => {
  res.send('HRMS API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));