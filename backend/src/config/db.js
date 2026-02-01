const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.NODE_ENV === 'production'
    ? process.env.MONGO_ATLAS_URI
    : process.env.MONGO_LOCAL_URI;

  if (!uri) {
    console.error('❌ Error: MONGO_URI is not defined in .env file');
    process.exit(1);
  }

  if (mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;