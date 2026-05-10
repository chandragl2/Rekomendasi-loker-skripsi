require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Job = require('../models/Job');
const { cleanJob } = require('../utils/cleaner');

const reclassifyJobs = async () => {
  try {
    await connectDB();
    const jobs = await Job.find({});
    console.log(`Ditemukan ${jobs.length} lowongan untuk dianalisis ulang.`);

    let updatedCount = 0;
    const categoryChanges = {};

    for (let job of jobs) {
      const rawJobData = job.toObject();
      const cleaned = cleanJob(rawJobData);
      
      if (cleaned && cleaned.category && cleaned.category !== job.category) {
        const oldCat = job.category;
        const newCat = cleaned.category;
        
        job.category = newCat;
        await job.save();
        updatedCount++;

        const changeKey = `${oldCat} -> ${newCat}`;
        categoryChanges[changeKey] = (categoryChanges[changeKey] || 0) + 1;
      }
    }
    
    console.log(`\nRe-klasifikasi selesai. Berhasil memperbarui ${updatedCount} lowongan.`);
    console.log('Rincian Perubahan Kategori:');
    console.table(categoryChanges);

    process.exit(0);
  } catch (error) {
    console.error('Error saat re-klasifikasi:', error);
    process.exit(1);
  }
};

reclassifyJobs();
