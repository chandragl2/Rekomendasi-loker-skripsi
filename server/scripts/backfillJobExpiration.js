'use strict';

const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Job = require('../models/Job');

dotenv.config({ path: path.join(__dirname, '../.env') });

const DEFAULT_DURATION_DAYS = 30;

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const startOfToday = (date = new Date()) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const isMissing = (value) => value === undefined || value === null;

const needsBackfillQuery = {
  $or: [
    { postedAt: { $exists: false } },
    { postedAt: null },
    { expiredAt: { $exists: false } },
    { expiredAt: null },
    { durationDays: { $exists: false } },
    { durationDays: null },
    { status: { $exists: false } },
    { status: null },
    { createdByType: { $exists: false } },
    { createdByType: null },
  ],
};

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-recommender';
  await mongoose.connect(mongoUri);

  const today = startOfToday();
  const jobs = await Job.find(needsBackfillQuery).lean();
  console.log(`Found ${jobs.length} jobs that need expiration backfill.`);

  const operations = jobs.map((job) => {
    const postedAt = isMissing(job.postedAt)
      ? (job.createdAt ? new Date(job.createdAt) : new Date())
      : new Date(job.postedAt);

    const durationDays = isMissing(job.durationDays) || Number(job.durationDays) < 1
      ? DEFAULT_DURATION_DAYS
      : Number(job.durationDays);

    const expiredAt = isMissing(job.expiredAt)
      ? addDays(postedAt, durationDays)
      : new Date(job.expiredAt);

    const status = isMissing(job.status)
      ? (expiredAt >= today ? 'active' : 'expired')
      : job.status;

    const createdByType = isMissing(job.createdByType)
      ? (job.url ? 'scraper' : 'company')
      : job.createdByType;

    return {
      updateOne: {
        filter: { _id: job._id },
        update: {
          $set: {
            postedAt,
            durationDays,
            expiredAt,
            status,
            createdByType,
            updatedAt: new Date(),
          },
        },
      },
    };
  });

  if (operations.length > 0) {
    const result = await Job.bulkWrite(operations);
    console.log(`Backfilled ${result.modifiedCount} jobs.`);
  }

  const expirationResult = await Job.expireOldJobs();
  console.log(`Marked ${expirationResult.modifiedCount} active jobs as expired.`);

  await mongoose.disconnect();
  console.log('Backfill complete. No jobs were deleted.');
}

main().catch(async (err) => {
  console.error('Backfill failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
