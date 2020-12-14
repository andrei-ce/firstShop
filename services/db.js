const mongoose = require('mongoose');
const config = require('config');
const connectionString = config.get('mongoURI');
const User = require('../models/user');

const connectDB = async (cb) => {
  try {
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongDB connected...');
    cb();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
