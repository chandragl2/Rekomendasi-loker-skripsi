'use strict';

const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const seedJobs = require('../data/seedJobs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const normalize = (value) =>
  `${value || ''}`.toLowerCase().replace(/\s+/g, ' ').trim();

const dummyJobKeys = new Set(
  seedJobs.map((job) => `${normalize(job.title)}|${normalize(job.location)}`)
);

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-recommender';
  await mongoose.connect(mongoUri);

  const jobs = await Job.find({
    title: { $in: seedJobs.map((job) => job.title) },
  })
    .select('_id title company location source createdByType companyId')
    .sort({ createdAt: 1, _id: 1 });

  const dummyJobs = jobs.filter((job) =>
    dummyJobKeys.has(`${normalize(job.title)}|${normalize(job.location)}`)
  );

  const jobsToMove = dummyJobs.filter((job) =>
    job.createdByType !== 'scraper'
    || job.source !== 'Dummy Scraper'
    || Boolean(job.companyId)
  );

  const now = new Date();
  const operations = jobsToMove.map((job) => ({
    updateOne: {
      filter: { _id: job._id },
      update: {
        $set: {
          createdByType: 'scraper',
          source: 'Dummy Scraper',
          updatedAt: now,
        },
        $unset: {
          companyId: '',
        },
      },
    },
  }));

  const result = operations.length > 0
    ? await Job.bulkWrite(operations, { ordered: false })
    : { matchedCount: 0, modifiedCount: 0 };

  console.log('=== Move Dummy Jobs To Scraper ===');
  console.log(`Seed jobs reference: ${seedJobs.length}`);
  console.log(`Dummy jobs matched: ${dummyJobs.length}`);
  console.log(`Dummy jobs needing update: ${jobsToMove.length}`);
  console.log(`Matched in bulkWrite: ${result.matchedCount}`);
  console.log(`Modified: ${result.modifiedCount}`);
  console.log('Tidak ada data yang dihapus.');

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Move dummy jobs to scraper failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
