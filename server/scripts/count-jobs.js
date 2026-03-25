require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../models/Job');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const cats = await Job.aggregate([
    { $group: { _id: '$category', total: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);
  const total = await Job.countDocuments();
  console.log('\n=== JOBS PER KATEGORI ===');
  cats.forEach(c => console.log(' ', (c._id || 'Uncategorized').padEnd(25), c.total));
  console.log('=========================');
  console.log('  TOTAL JOBS:', total);
  mongoose.disconnect();
}).catch(e => { console.error(e); process.exit(1); });
