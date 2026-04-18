const mongoose = require('mongoose');
const env = require('./env');

const connectDatabase = async () => {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is not configured.');
  }

  await mongoose.connect(env.mongoUri, {
    autoIndex: true,
  });

  console.log('MongoDB connected');
};

module.exports = connectDatabase;
