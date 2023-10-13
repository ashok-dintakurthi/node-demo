// src/app.js
const express = require('express');
const app = express();
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const feedRoutes = require('./src/routes/feedRoutes');
const logRoutes = require('./src/routes/logsRoutes');
const dotenv = require('dotenv');
const seedData = require('./src/services/seed');
const cronJob = require('./src/services/cron');
const mongoose = require('./src/config/mongoose');


dotenv.config();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/feed', feedRoutes);
app.use('/log', logRoutes);

app.get('/', (req, res, next) => {
    res.send('Hello World');
});
const port = process.env.PORT || 3000;
mongoose();

seedData.addSuperAdmin();
cronJob.scheduleCronJobs();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
