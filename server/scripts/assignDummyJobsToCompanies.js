'use strict';

const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Company = require('../models/Company');
const Job = require('../models/Job');

dotenv.config({ path: path.join(__dirname, '../.env') });

const DEFAULT_DURATION_DAYS = 30;

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const dummyJobsQuery = {
  $or: [
    { url: { $exists: false } },
    { url: null },
    { url: '' },
  ],
};

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-recommender';
  await mongoose.connect(mongoUri);

  const companies = await Company.find({}).sort({ createdAt: 1, _id: 1 }).lean();
  const dummyJobs = await Job.find(dummyJobsQuery).sort({ createdAt: 1, _id: 1 }).lean();

  console.log('=== Assign Dummy Jobs To Companies ===');
  console.log(`Jumlah company: ${companies.length}`);
  console.log(`Jumlah dummy jobs ditemukan: ${dummyJobs.length}`);

  if (companies.length === 0) {
    console.log('Tidak ada company. Assignment dibatalkan.');
    await mongoose.disconnect();
    return;
  }

  if (dummyJobs.length === 0) {
    console.log('Tidak ada dummy jobs dengan URL kosong/missing. Tidak ada data yang diubah.');
    await mongoose.disconnect();
    return;
  }

  const assignmentCounts = new Map(
    companies.map((company) => [
      company._id.toString(),
      {
        companyName: company.companyName,
        count: 0,
      },
    ])
  );

  const now = new Date();
  const operations = dummyJobs.map((job, index) => {
    const company = companies[index % companies.length];
    const postedAt = job.createdAt ? new Date(job.createdAt) : now;
    const expiredAt = addDays(postedAt, DEFAULT_DURATION_DAYS);
    const companyKey = company._id.toString();
    const currentAssignment = assignmentCounts.get(companyKey);
    currentAssignment.count += 1;

    return {
      updateOne: {
        filter: {
          _id: job._id,
          ...dummyJobsQuery,
        },
        update: {
          $set: {
            companyId: company._id,
            createdByType: 'company',
            source: 'Company',
            status: 'active',
            durationDays: DEFAULT_DURATION_DAYS,
            postedAt,
            expiredAt,
            updatedAt: now,
          },
        },
      },
    };
  });

  const result = await Job.bulkWrite(operations, { ordered: false });

  console.log(`Jumlah jobs berhasil diassign: ${result.modifiedCount}`);
  console.log('Pembagian jumlah jobs per company:');

  companies.forEach((company) => {
    const assignment = assignmentCounts.get(company._id.toString());
    console.log(`- ${assignment.companyName} (${company._id}): ${assignment.count}`);
  });

  await mongoose.disconnect();
  console.log('Assignment selesai. Tidak ada data yang dihapus dan jobs dengan URL tidak diubah.');
}

main().catch(async (err) => {
  console.error('Assign dummy jobs failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
