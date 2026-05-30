'use strict';

const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const { normalizeCategory } = require('../utils/category');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-recommender';
  await mongoose.connect(mongoUri);

  const totalBefore = await Job.countDocuments();
  const jobs = await Job.find({}, { category: 1 }).lean();

  const operations = jobs
    .map((job) => {
      const normalizedCategory = normalizeCategory(job.category);
      if (normalizedCategory === job.category) return null;

      return {
        updateOne: {
          filter: { _id: job._id },
          update: {
            $set: {
              category: normalizedCategory,
              updatedAt: new Date(),
            },
          },
        },
      };
    })
    .filter(Boolean);

  if (operations.length > 0) {
    const result = await Job.bulkWrite(operations);
    console.log(`Updated categories for ${result.modifiedCount} jobs.`);
  } else {
    console.log('No category updates needed.');
  }

  const totalAfter = await Job.countDocuments();
  console.log(`Total jobs before: ${totalBefore}`);
  console.log(`Total jobs after : ${totalAfter}`);
  console.log('Category backfill complete. No jobs were deleted.');

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Category backfill failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
