/**
 * seed-and-export.js
 * Seeds 100 extra jobs to MongoDB, then exports ALL jobs to CSV.
 * Run: node scripts/seed-and-export.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');

const Job = require('../models/Job');
const extraJobs = require('../data/extraJobs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-recommender';

async function main() {
  console.log('🔌 Connecting to MongoDB:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  // ── 1. SEED ───────────────────────────────────────────────────────────────
  console.log(`📦 Inserting ${extraJobs.length} new jobs...`);

  let inserted = 0;
  let skipped  = 0;
  for (const job of extraJobs) {
    const exists = await Job.findOne({ title: job.title, company: job.company });
    if (exists) {
      console.log(`  ⚠️  Skipped (already exists): ${job.title} @ ${job.company}`);
      skipped++;
    } else {
      await Job.create(job);
      console.log(`  ✅ Inserted: ${job.title} @ ${job.company}`);
      inserted++;
    }
  }

  console.log(`\n📊 Seed Result: ${inserted} inserted, ${skipped} skipped\n`);

  // ── 2. EXPORT TO CSV ──────────────────────────────────────────────────────
  const outputDir = path.join(__dirname, '../data');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const csvPath = path.join(outputDir, 'all_jobs.csv');

  const allJobs = await Job.find({}).sort({ category: 1, createdAt: 1 }).lean();
  console.log(`📋 Total jobs in DB: ${allJobs.length}`);

  const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: [
      { id: '_id',         title: 'ID' },
      { id: 'title',       title: 'Title' },
      { id: 'company',     title: 'Company' },
      { id: 'location',    title: 'Location' },
      { id: 'type',        title: 'Type' },
      { id: 'category',    title: 'Category' },
      { id: 'skills',      title: 'Skills' },
      { id: 'description', title: 'Description' },
      { id: 'createdAt',   title: 'Created At' },
    ]
  });

  const rows = allJobs.map(j => ({
    ...j,
    _id: j._id.toString(),
    skills: Array.isArray(j.skills) ? j.skills.join('; ') : '',
    description: j.description.replace(/\r?\n/g, ' '),
    createdAt: j.createdAt ? new Date(j.createdAt).toISOString() : '',
  }));

  await csvWriter.writeRecords(rows);
  console.log(`\n✅ CSV exported to: ${csvPath}`);

  // ── 3. STATS ──────────────────────────────────────────────────────────────
  const categories = {};
  allJobs.forEach(j => {
    categories[j.category] = (categories[j.category] || 0) + 1;
  });

  console.log('\n📊 Jobs per Category:');
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      const bar = '█'.repeat(Math.ceil(count / 2));
      console.log(`  ${cat.padEnd(20)} ${String(count).padStart(3)}  ${bar}`);
    });

  await mongoose.disconnect();
  console.log('\n🔌 Disconnected. Done!');
}

main().catch(err => {
  console.error('❌ Error:', err);
  mongoose.disconnect();
  process.exit(1);
});
