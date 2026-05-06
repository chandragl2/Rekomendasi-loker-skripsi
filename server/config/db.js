const mongoose = require('mongoose');

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
    cachedDb = db;
    return db;
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // On Vercel, we shouldn't exit the process
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw err;
  }
};

module.exports = connectDB;
