const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const Job = require('../models/Job');
const { normalizeCategory, displayCategory } = require('../utils/category');

const ALLOWED_DURATIONS = [7, 14, 30, 60];

const getJwtSecret = () => process.env.JWT_SECRET || process.env.COMPANY_JWT_SECRET || 'jobmatch-company-dev-secret';

const generateToken = (companyId) => jwt.sign({ id: companyId, type: 'company' }, getJwtSecret(), {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
});

const formatCompany = (company) => ({
  id: company._id,
  companyName: company.companyName,
  email: company.email,
  phone: company.phone,
  address: company.address,
});

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeJobForResponse = (job) => ({
  ...(typeof job.toObject === 'function' ? job.toObject() : job),
  category: displayCategory(job.category),
});

const registerCompany = async (req, res) => {
  try {
    const { companyName, email, password, phone, address } = req.body;

    if (!companyName || !email || !password || !phone || !address) {
      return res.status(400).json({ message: 'Semua field company wajib diisi' });
    }

    const existingCompany = await Company.findOne({ email: email.toLowerCase().trim() });
    if (existingCompany) {
      return res.status(400).json({ message: 'Email perusahaan sudah terdaftar' });
    }

    const company = await Company.create({
      companyName,
      email,
      password,
      phone,
      address,
    });

    res.status(201).json({
      token: generateToken(company._id),
      company: formatCompany(company),
    });
  } catch (err) {
    res.status(400).json({ message: 'Register perusahaan gagal', error: err.message });
  }
};

const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    const company = await Company.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!company || !(await company.matchPassword(password))) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    res.json({
      token: generateToken(company._id),
      company: formatCompany(company),
    });
  } catch (err) {
    res.status(500).json({ message: 'Login perusahaan gagal', error: err.message });
  }
};

const getCompanyMe = async (req, res) => {
  res.json({
    company: formatCompany(req.company),
  });
};

const createCompanyJob = async (req, res) => {
  try {
    const requiredFields = ['title', 'location', 'type', 'category', 'description'];
    const missingFields = requiredFields.filter((field) => !String(req.body[field] || '').trim());

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Field wajib belum lengkap: ${missingFields.join(', ')}`,
      });
    }

    const skills = normalizeList(req.body.skills);
    const qualifications = normalizeList(req.body.qualifications);

    if (skills.length === 0) {
      return res.status(400).json({ message: 'Skills wajib diisi minimal 1 item' });
    }

    if (qualifications.length === 0) {
      return res.status(400).json({ message: 'Qualifications wajib diisi minimal 1 item' });
    }

    const requestedDuration = Number(req.body.durationDays);
    const durationDays = ALLOWED_DURATIONS.includes(requestedDuration) ? requestedDuration : 30;
    const postedAt = new Date();

    const job = await Job.create({
      title: String(req.body.title).trim(),
      company: String(req.body.company || req.company.companyName).trim(),
      location: String(req.body.location).trim(),
      type: String(req.body.type).trim(),
      category: normalizeCategory(req.body.category),
      description: String(req.body.description).trim(),
      skills,
      qualifications,
      companyId: req.company._id,
      source: 'Company',
      createdByType: 'company',
      status: 'active',
      postedAt,
      durationDays,
    });

    res.status(201).json(normalizeJobForResponse(job));
  } catch (err) {
    const validationMessage = err.name === 'ValidationError'
      ? Object.values(err.errors).map((item) => item.message).join(', ')
      : err.message;

    res.status(400).json({
      message: validationMessage || 'Gagal membuat lowongan perusahaan',
      error: err.message,
    });
  }
};

const getCompanyJobs = async (req, res) => {
  try {
    await Job.expireOldJobs();

    const jobs = await Job.find({
      companyId: req.company._id,
      createdByType: 'company',
    }).sort({ createdAt: -1 });

    res.json({
      jobs: jobs.map(normalizeJobForResponse),
      total: jobs.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memuat lowongan perusahaan', error: err.message });
  }
};

module.exports = {
  registerCompany,
  loginCompany,
  getCompanyMe,
  createCompanyJob,
  getCompanyJobs,
};
