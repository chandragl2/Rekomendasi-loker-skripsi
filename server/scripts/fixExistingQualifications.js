const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');
const connectDB = require('../config/db');
const { cleanJob } = require('../utils/cleaner');

dotenv.config();

const fixQualifications = async () => {
  try {
    await connectDB();

    console.log('🔍 Mengambil semua lowongan untuk diperbaiki...');
    const jobs = await Job.find({});
    console.log(`Found ${jobs.length} jobs.`);

    let updatedCount = 0;

    for (const job of jobs) {
      // Re-clean the job using the updated logic
      // Note: cleanJob needs a raw object structure similar to what scraper returns
      const rawJobData = {
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        category: job.category,
        description: job.description,
        skills: job.skills,
        source: job.source,
        url: job.url
      };

      const cleanedData = cleanJob(rawJobData);

      // Update the fields that might have changed (mainly qualifications)
      job.qualifications = cleanedData.qualifications;
      
      // Also ensure description is clean if it wasn't
      job.description = cleanedData.description;

      await job.save();
      updatedCount++;

      if (updatedCount % 10 === 0) {
        console.log(`Processed ${updatedCount}/${jobs.length} jobs...`);
      }
    }

    console.log(`✅ Berhasil memperbaiki ${updatedCount} lowongan.`);
    process.exit();
  } catch (error) {
    console.error('❌ Error fixing qualifications:', error);
    process.exit(1);
  }
};

fixQualifications();
