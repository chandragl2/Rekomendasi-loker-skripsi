const Application = require('../models/Application');
const Company = require('../models/Company');
const Job = require('../models/Job');

const getAdminCompanies = async (req, res) => {
  try {
    const [companies, jobCounts, applicationCounts] = await Promise.all([
      Company.find().sort({ createdAt: -1 }).lean(),
      Job.aggregate([
        { $match: { companyId: { $ne: null } } },
        { $group: { _id: '$companyId', totalJobs: { $sum: 1 } } },
      ]),
      Application.aggregate([
        { $group: { _id: '$companyId', totalApplications: { $sum: 1 } } },
      ]),
    ]);

    const jobCountMap = jobCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.totalJobs;
      return acc;
    }, {});

    const applicationCountMap = applicationCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.totalApplications;
      return acc;
    }, {});

    const enrichedCompanies = companies.map((company) => {
      const companyId = company._id.toString();
      return {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
        phone: company.phone,
        address: company.address,
        totalJobs: jobCountMap[companyId] || 0,
        totalApplications: applicationCountMap[companyId] || 0,
        createdAt: company.createdAt,
      };
    });

    res.json({
      companies: enrichedCompanies,
      summary: {
        totalCompanies: enrichedCompanies.length,
        totalCompanyJobs: enrichedCompanies.reduce((total, company) => total + company.totalJobs, 0),
        totalApplications: enrichedCompanies.reduce((total, company) => total + company.totalApplications, 0),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memuat daftar company', error: err.message });
  }
};

const getAdminActivity = async (req, res) => {
  try {
    const [jobs, applications] = await Promise.all([
      Job.find({
        $or: [
          { createdByType: 'company' },
          { createdByType: 'scraper' },
          { status: 'expired' },
        ],
      })
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(50)
        .lean(),
      Application.find()
        .populate('jobId', 'title company')
        .sort({ updatedAt: -1, appliedAt: -1 })
        .limit(50)
        .lean(),
    ]);

    const activities = [];

    jobs.forEach((job) => {
      if (job.createdByType === 'scraper') {
        activities.push({
          id: `scraper-job-${job._id}`,
          type: 'scraper_job_synced',
          title: 'Scraper job synced',
          description: `Lowongan ${job.title} di ${job.company} tersimpan sebagai data scraper.`,
          occurredAt: job.updatedAt || job.createdAt,
        });
      }

      if (job.createdByType === 'company') {
        activities.push({
          id: `job-created-${job._id}`,
          type: 'job_created',
          title: 'Job created by company',
          description: `${job.company} membuat lowongan ${job.title}.`,
          occurredAt: job.createdAt,
        });
      }

      if (job.status === 'expired') {
        activities.push({
          id: `job-expired-${job._id}`,
          type: 'job_expired',
          title: 'Job expired',
          description: `Lowongan ${job.title} di ${job.company} sudah expired.`,
          occurredAt: job.updatedAt || job.expiredAt,
        });
      }
    });

    applications.forEach((application) => {
      const jobTitle = application.jobId?.title || 'lowongan company';

      activities.push({
        id: `application-submitted-${application._id}`,
        type: 'application_submitted',
        title: 'Application submitted',
        description: `${application.candidateName} melamar ${jobTitle}.`,
        occurredAt: application.appliedAt,
      });

      if (application.status === 'accepted' || application.status === 'rejected') {
        activities.push({
          id: `application-${application.status}-${application._id}`,
          type: application.status === 'accepted' ? 'application_accepted' : 'application_rejected',
          title: application.status === 'accepted' ? 'Application accepted' : 'Application rejected',
          description: `${application.candidateName} ${application.status === 'accepted' ? 'diterima' : 'ditolak'} untuk ${jobTitle}.`,
          occurredAt: application.updatedAt,
        });
      }
    });

    activities.sort((a, b) => new Date(b.occurredAt || 0) - new Date(a.occurredAt || 0));

    res.json({
      activities: activities.slice(0, 50),
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memuat activity log', error: err.message });
  }
};

module.exports = {
  getAdminCompanies,
  getAdminActivity,
};
