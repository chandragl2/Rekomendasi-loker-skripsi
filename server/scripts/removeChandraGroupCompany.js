'use strict';

const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Company = require('../models/Company');
const Job = require('../models/Job');

dotenv.config({ path: path.join(__dirname, '../.env') });

const TARGET_COMPANY_NAME = 'PT Chandra Group';
const MIGRATED_COMPANY_NAME = 'External Scraper';

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-recommender';
  await mongoose.connect(mongoUri);

  const targetCompanies = await Company.find({
    companyName: TARGET_COMPANY_NAME,
  }).lean();

  const targetCompanyIds = targetCompanies.map((company) => company._id);
  const companyJobQuery = {
    $or: [
      ...(targetCompanyIds.length > 0 ? [{ companyId: { $in: targetCompanyIds } }] : []),
      { company: TARGET_COMPANY_NAME },
    ],
  };

  const companyJobs = await Job.find(companyJobQuery).select('_id').lean();
  const companyJobIds = companyJobs.map((job) => job._id);
  const now = new Date();

  const jobsResult = await Job.updateMany(
    companyJobQuery,
    {
      $set: {
        company: MIGRATED_COMPANY_NAME,
        createdByType: 'scraper',
        source: 'Migrated Scraper',
        updatedAt: now,
      },
      $unset: {
        companyId: '',
      },
    }
  );

  const applicationsQuery = {
    $or: [
      ...(targetCompanyIds.length > 0 ? [{ companyId: { $in: targetCompanyIds } }] : []),
      ...(companyJobIds.length > 0 ? [{ jobId: { $in: companyJobIds } }] : []),
    ],
  };

  const applicationsResult = applicationsQuery.$or.length > 0
    ? await Application.deleteMany(applicationsQuery)
    : { deletedCount: 0 };

  const companiesResult = targetCompanyIds.length > 0
    ? await Company.deleteMany({ _id: { $in: targetCompanyIds } })
    : { deletedCount: 0 };

  console.log('=== Remove Chandra Group Company ===');
  console.log(`Target companies found: ${targetCompanies.length}`);
  console.log(`Related jobs migrated to scraper: ${jobsResult.modifiedCount}`);
  console.log(`Related applications deleted: ${applicationsResult.deletedCount}`);
  console.log(`Target company records deleted: ${companiesResult.deletedCount}`);
  console.log('Company feature and other companies were not removed.');
  console.log('Job documents were not deleted.');

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Remove Chandra Group company failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
