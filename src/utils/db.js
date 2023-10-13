const mongoose = require('mongoose');
const config = require('../config/config');
const dotenv = require('dotenv');
dotenv.config();
const mongoString = 'mongodb://localhost:27017/mydatabase';
const connectDB = async () => {
  try {
    await mongoose.connect(mongoString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

module.exports = connectDB;
