const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');

dotenv.config();

const checkStats = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const stats = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    console.log('--- STATISTIK KATEGORI ---');
    console.log(JSON.stringify(stats, null, 2));
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkStats();
