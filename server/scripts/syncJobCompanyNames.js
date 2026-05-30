'use strict';

const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Company = require('../models/Company');
const Job = require('../models/Job');

dotenv.config({ path: path.join(__dirname, '../.env') });

const companyJobsQuery = {
  createdByType: 'company',
  companyId: {
    $exists: true,
    $ne: null,
  },
};

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-recommender';
  await mongoose.connect(mongoUri);

  const jobs = await Job.find(companyJobsQuery)
    .select('_id company companyId')
    .sort({ createdAt: 1, _id: 1 })
    .lean();

  const companyIds = [...new Set(jobs.map((job) => job.companyId.toString()))];
  const companies = await Company.find({ _id: { $in: companyIds } })
    .select('_id companyName')
    .lean();

  const companyMap = new Map(
    companies.map((company) => [company._id.toString(), company.companyName])
  );

  let skippedInvalidCompanyId = 0;
  const changeExamples = [];
  const now = new Date();

  const operations = jobs.reduce((acc, job) => {
    const companyName = companyMap.get(job.companyId.toString());

    if (!companyName) {
      skippedInvalidCompanyId += 1;
      return acc;
    }

    if (job.company === companyName) {
      return acc;
    }

    if (changeExamples.length < 5) {
      changeExamples.push(`"${job.company || ''}" -> "${companyName}"`);
    }

    acc.push({
      updateOne: {
        filter: {
          _id: job._id,
          createdByType: 'company',
          companyId: job.companyId,
        },
        update: {
          $set: {
            company: companyName,
            updatedAt: now,
          },
        },
      },
    });

    return acc;
  }, []);

  const result = operations.length > 0
    ? await Job.bulkWrite(operations, { ordered: false })
    : { modifiedCount: 0 };

  console.log('=== Sync Job Company Names ===');
  console.log(`Total company jobs ditemukan: ${jobs.length}`);
  console.log(`Total berhasil diupdate: ${result.modifiedCount}`);
  console.log(`Total dilewati karena companyId tidak valid: ${skippedInvalidCompanyId}`);

  if (changeExamples.length > 0) {
    console.log('Contoh perubahan:');
    changeExamples.forEach((example) => console.log(`- ${example}`));
  } else {
    console.log('Contoh perubahan: tidak ada, semua nama company sudah sinkron.');
  }

  await mongoose.disconnect();
  console.log('Sync selesai. Script aman dijalankan berulang kali dan tidak membuat data duplicate.');
}

main().catch(async (err) => {
  console.error('Sync job company names failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
