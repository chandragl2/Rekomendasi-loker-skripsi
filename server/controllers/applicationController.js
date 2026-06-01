const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');

const ALLOWED_STATUSES = ['pending', 'accepted', 'rejected'];

const isCompanyJob = (job) => job.createdByType === 'company' || job.source === 'Company';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const normalizeOptionalScore = (score) => {
  if (score === undefined || score === null || score === '') {
    return null;
  }

  const parsedScore = Number(score);
  return Number.isFinite(parsedScore) ? parsedScore : null;
};

const applyJob = async (req, res) => {
  try {
    const {
      jobId,
      candidateName,
      candidateEmail,
      candidatePhone,
      cvText,
      cvFileName,
      similarityScore,
    } = req.body;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'jobId tidak valid' });
    }

    if (!candidateName || !candidateEmail || !candidatePhone) {
      return res.status(400).json({ message: 'Nama, email, dan no HP wajib diisi' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Lowongan tidak ditemukan' });
    }

    if (!isCompanyJob(job) || !job.companyId) {
      return res.status(400).json({
        message: 'Lowongan ini berasal dari sumber eksternal. Silakan lamar melalui URL asli.',
        redirectUrl: job.url || null,
      });
    }

    const normalizedEmail = normalizeEmail(candidateEmail);
    const duplicate = await Application.findOne({
      jobId: job._id,
      candidateEmail: normalizedEmail,
    });

    if (duplicate) {
      return res.status(409).json({ message: 'Email ini sudah pernah melamar lowongan tersebut' });
    }

    const application = await Application.create({
      jobId: job._id,
      companyId: job.companyId,
      candidateName,
      candidateEmail: normalizedEmail,
      candidatePhone,
      cvText: cvText || '',
      cvFileName: cvFileName || '',
      similarityScore: normalizeOptionalScore(similarityScore),
      status: 'pending',
    });

    const populatedApplication = await Application.findById(application._id).populate(
      'jobId',
      'title company category location'
    );

    res.status(201).json({
      message: 'Lamaran berhasil dikirim',
      application: populatedApplication,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email ini sudah pernah melamar lowongan tersebut' });
    }

    res.status(500).json({ message: 'Gagal mengirim lamaran', error: err.message });
  }
};

const getCompanyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ companyId: req.company._id })
      .populate('jobId', 'title company category location')
      .sort({ appliedAt: -1 });

    res.json({
      applications,
      total: applications.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memuat daftar pelamar', error: err.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Status hanya boleh pending, accepted, atau rejected' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Application id tidak valid' });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      companyId: req.company._id,
    });

    if (!application) {
      return res.status(404).json({ message: 'Lamaran tidak ditemukan untuk perusahaan ini' });
    }

    application.status = status;
    application.updatedAt = new Date();
    await application.save();
    await application.populate('jobId', 'title company category location');

    res.json({
      message: 'Status lamaran berhasil diperbarui',
      application,
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui status lamaran', error: err.message });
  }
};

module.exports = {
  applyJob,
  getCompanyApplications,
  updateApplicationStatus,
};
