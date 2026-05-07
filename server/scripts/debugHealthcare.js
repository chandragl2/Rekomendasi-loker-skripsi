const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');

dotenv.config();

const debug = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const regex = /dokter|perawat|bidan|apoteker|farmasi|klinik|rumah sakit|gizi|nutrisi|healthcare|medical|doctor|nurse|pharmacy|clinic|hospital/i;
    
    const jobs = await Job.find({
      $or: [
        { title: regex },
        { description: regex }
      ]
    });

    console.log(`🔍 Ditemukan ${jobs.length} lowongan yang berpotensi masuk Healthcare:`);
    for (const job of jobs) {
      console.log(`- [${job.category}] ${job.title} (${job.company})`);
      if (job.category !== 'Healthcare & Medical') {
        job.category = 'Healthcare & Medical';
        await job.save();
        console.log(`  🚀 DIPINDAHKAN ke Healthcare & Medical`);
      }
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

debug();
