const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const Vocabulary = require('../models/Vocabulary');
const preprocessText = require('../utils/preprocess');
const { buildVocabulary, createVector } = require('../utils/tfidf');
const calculateCosineSimilarity = require('../utils/cosineSimilarity');
const calculateFinalScore = require('../utils/scoreNormalizer');
const { detectCategory, displayCategory, getCategoryAliases, normalizeCategory } = require('../utils/category');
const pdfParse = require('pdf-parse');
const { cleanJob, cleanJobs } = require('../utils/cleaner');
const fs = require('fs');
const path = require('path');

// Fallback Seed Data
const seedJobs = require('../data/seedJobs');

const CATEGORY_COLORS = [
  '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#f97316', '#6366f1', '#14b8a6',
  '#64748b', '#0f172a'
];

const CV_INDICATOR_PATTERNS = [
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
  /(?:\+?\d[\s.-]?){9,15}/,
  /\b(pendidikan|education)\b/i,
  /\b(pengalaman|experience)\b/i,
  /\b(skills?|keterampilan|keahlian)\b/i,
  /\b(project|portfolio|linkedin)\b/i,
  /\b(summary|profile|profil|ringkasan)\b/i,
];

const isLikelyCV = (text) => {
  const normalizedText = `${text || ''}`.toLowerCase();
  const indicatorCount = CV_INDICATOR_PATTERNS.reduce(
    (count, pattern) => count + (pattern.test(normalizedText) ? 1 : 0),
    0
  );

  return indicatorCount >= 3;
};

const normalizeJobForResponse = (job) => ({
  ...(typeof job.toObject === 'function' ? job.toObject() : job),
  category: displayCategory(job.category),
});

const startOfToday = (date = new Date()) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const getActiveJobsQuery = (referenceDate = new Date()) => ({
  status: 'active',
  $or: [
    { expiredAt: { $exists: false } },
    { expiredAt: null },
    { expiredAt: { $gte: startOfToday(referenceDate) } },
  ],
});

const getExpiredJobsQuery = (referenceDate = new Date()) => ({
  $or: [
    { status: 'expired' },
    { expiredAt: { $lt: startOfToday(referenceDate) } },
  ],
});

const normalizeDedupeValue = (value) =>
  `${value || ''}`.toLowerCase().replace(/\s+/g, ' ').trim();

const getDuplicateJobKey = (job) =>
  normalizeDedupeValue(job.dedupeKey) || [
    normalizeDedupeValue(job.title),
    normalizeDedupeValue(job.company),
    normalizeDedupeValue(job.location),
  ].join('|');

const removeDuplicateJobs = (jobs) => {
  const seen = new Set();

  return jobs.filter((job) => {
    const key = getDuplicateJobKey(job);
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

const buildNormalizedCategoryData = (rawCategories) => {
  const counts = rawCategories.reduce((acc, cat) => {
    const name = normalizeCategory(cat._id);
    acc[name] = (acc[name] || 0) + cat.count;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], index) => ({
      name: displayCategory(name),
      value,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));
};

const buildCategoryDataFromJobs = (jobs) => {
  const rawCategories = jobs.reduce((acc, job) => {
    const category = job.category || 'Miscellaneous';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return buildNormalizedCategoryData(
    Object.entries(rawCategories).map(([category, count]) => ({
      _id: category,
      count,
    }))
  );
};

// ─────────────────────────────────────────────────────────
// Helper: preprocess + vektorisasi seluruh corpus dan simpan ke DB
// ─────────────────────────────────────────────────────────
const buildAndSave = async (jobData) => {
  // Bersihkan & deduplikasi semua job sebelum diproses
  const cleanedJobs = cleanJobs(jobData);
  console.log(`[CLEANER] ${jobData.length} jobs → ${cleanedJobs.length} after cleaning & dedup.`);

  const allDocsTokens = [];

  const processedJobs = cleanedJobs.map(job => {
    const skills         = job.skills || [];
    const qualifications = job.qualifications || [];

    // 🔥 Boosting sesuai instruksi poin 1:
    // title 3x, skills 3x (spread individual), qualifications 2x, description 1x
    const jobText = [
      job.title || '', job.title || '', job.title || '', // title 3x
      ...skills, ...skills, ...skills,                   // skills 3x individual
      ...qualifications, ...qualifications,              // qualifications 2x
      job.description || ''                              // description 1x
    ].join(' ');

    const tokens = preprocessText(jobText);
    allDocsTokens.push(tokens);
    return { ...job, processedText: tokens };
  });

  // Build vocabulary & IDF
  const { terms, idf } = buildVocabulary(allDocsTokens);

  // Simpan vocabulary baru
  await Vocabulary.deleteMany({});
  await Vocabulary.create({ terms, idf, totalDocuments: allDocsTokens.length });

  // Vektorisasi & simpan semua jobs (applyBoost=true → IT skill mendapat multiplier x2.5)
  await Job.deleteMany({});
  const jobsToSave = processedJobs.map(job => ({
    ...job,
    tfidfVector: createVector(job.processedText, idf, true)
  }));
  await Job.insertMany(jobsToSave);

  return { terms, jobsToSave };
};

// ─────────────────────────────────────────────────────────
// @desc    Ambil semua lowongan dari DB (untuk halaman browse)
// @route   GET /api/jobs/all
// ─────────────────────────────────────────────────────────
const getAllJobs = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    await Job.expireOldJobs();

    const queryClauses = [getActiveJobsQuery()];

    if (category && category !== 'Semua') {
      queryClauses.push({ category: { $in: getCategoryAliases(category) } });
    }

    if (search) {
      queryClauses.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { skills: { $regex: search, $options: 'i' } }
        ],
      });
    }

    const query = { $and: queryClauses };

    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.max(parseInt(limit, 10) || 20, 1);

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .lean();
    const uniqueJobs = removeDuplicateJobs(jobs);
    const paginatedJobs = uniqueJobs.slice(
      (parsedPage - 1) * parsedLimit,
      parsedPage * parsedLimit
    );

    res.json({
      jobs: paginatedJobs.map(normalizeJobForResponse),
      total: uniqueJobs.length,
      page: parsedPage,
      totalPages: Math.ceil(uniqueJobs.length / parsedLimit) || 1
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// @desc    Ambil semua lowongan untuk admin, termasuk expired/inactive
// @route   GET /api/jobs/admin/jobs
const getAdminJobs = async (req, res) => {
  try {
    const {
      search,
      status,
      createdByType,
      page = 1,
      limit = 10,
    } = req.query;

    await Job.expireOldJobs();

    const queryClauses = [];

    if (['active', 'expired', 'inactive'].includes(status)) {
      if (status === 'active') {
        queryClauses.push(getActiveJobsQuery());
      } else if (status === 'expired') {
        queryClauses.push(getExpiredJobsQuery());
      } else {
        queryClauses.push({ status });
      }
    }

    if (['scraper', 'company'].includes(createdByType)) {
      queryClauses.push({ createdByType });
    }

    if (search) {
      queryClauses.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
        ],
      });
    }

    const query = queryClauses.length > 0 ? { $and: queryClauses } : {};

    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.max(parseInt(limit, 10) || 10, 1);

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    res.json({
      jobs: jobs.map(normalizeJobForResponse),
      total,
      page: parsedPage,
      totalPages: Math.ceil(total / parsedLimit) || 1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// @desc    Statistik lowongan untuk dashboard admin
// @route   GET /api/jobs/admin/jobs/stats
const getAdminJobStats = async (req, res) => {
  try {
    await Job.expireOldJobs();

    const [
      totalJobs,
      totalActive,
      totalExpired,
      totalDisplayedJobs,
      totalScraperJobs,
      totalCompanyJobs,
      latestScraperJob,
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments(getActiveJobsQuery()),
      Job.countDocuments(getExpiredJobsQuery()),
      Job.find(getActiveJobsQuery()).lean().then((jobs) => removeDuplicateJobs(jobs).length),
      Job.countDocuments({ createdByType: 'scraper' }),
      Job.countDocuments({ createdByType: 'company' }),
      Job.findOne({ createdByType: 'scraper' }).sort({ updatedAt: -1 }).select('updatedAt').lean(),
    ]);
    const lastScraperUpdate = latestScraperJob ? latestScraperJob.updatedAt : null;

    res.json({
      totalJobs,
      totalActive,
      totalExpired,
      totalDisplayedJobs,
      totalScraperJobs,
      totalCompanyJobs,
      lastScraperUpdate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// @desc    Create a company-submitted job
// @route   POST /api/jobs
const createJob = async (req, res) => {
  try {
    const allowedDurations = [7, 14, 30, 60];
    const requestedDuration = Number(req.body.durationDays);
    const durationDays = allowedDurations.includes(requestedDuration) ? requestedDuration : 30;

    const job = await Job.create({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      type: req.body.type,
      category: normalizeCategory(req.body.category),
      skills: req.body.skills,
      qualifications: req.body.qualifications,
      description: req.body.description,
      source: req.body.source || 'Company',
      postedAt: new Date(),
      durationDays,
      status: 'active',
      createdByType: 'company',
    });

    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create job', error: err.message });
  }
};

// @desc    Aktifkan/nonaktifkan lowongan oleh admin
// @route   PATCH /api/jobs/admin/jobs/:id/status
const updateAdminJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status hanya boleh active atau inactive' });
    }

    await Job.expireOldJobs();

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status === 'expired') {
      return res.status(400).json({ message: 'Lowongan expired tidak bisa diaktifkan/nonaktifkan manual' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (status === 'active' && job.expiredAt && job.expiredAt < today) {
      job.status = 'expired';
      await job.save();
      return res.status(400).json({ message: 'Lowongan sudah expired dan tidak bisa diaktifkan kembali' });
    }

    job.status = status;
    job.updatedAt = new Date();
    await job.save();

    res.json(normalizeJobForResponse(job));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// @desc    Ingest scraped jobs from an external scraper service
// @route   POST /api/jobs/scraper-ingest
const ingestScrapedJobs = async (req, res) => {
  try {
    const payload = Array.isArray(req.body.jobs) ? req.body.jobs : [req.body];
    const scrapedAt = new Date();
    const durationDays = 30;
    const expiredAt = new Date(scrapedAt);
    expiredAt.setDate(expiredAt.getDate() + durationDays);

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    const errors = [];

    for (const rawJob of payload) {
      const cleaned = cleanJob({
        ...rawJob,
        postedAt: scrapedAt,
        durationDays,
        expiredAt,
        status: 'active',
        createdByType: 'scraper',
        source: rawJob.source || 'External Scraper',
      });

      if (!cleaned || !cleaned.title || !cleaned.company) {
        skipped++;
        errors.push({ title: rawJob.title, error: 'Invalid job payload' });
        continue;
      }

      const lookup = {
        $or: [
          ...(cleaned.url ? [{ url: cleaned.url }] : []),
          { title: cleaned.title, company: cleaned.company },
        ],
      };

      const existing = await Job.findOne(lookup).lean();

      if (existing) {
        const isSameUrl = cleaned.url && existing.url === cleaned.url;
        const isScraperJob = existing.createdByType === 'scraper' || isSameUrl;

        if (!isScraperJob) {
          skipped++;
          continue;
        }

        await Job.updateOne(
          { _id: existing._id },
          {
            $set: {
              ...cleaned,
              postedAt: scrapedAt,
              durationDays,
              expiredAt,
              status: 'active',
              createdByType: 'scraper',
              updatedAt: scrapedAt,
            },
          }
        );
        updated++;
        continue;
      }

      await Job.create({
        ...cleaned,
        postedAt: scrapedAt,
        durationDays,
        expiredAt,
        status: 'active',
        createdByType: 'scraper',
      });
      inserted++;
    }

    res.status(201).json({
      message: 'Scraped jobs ingested',
      total: payload.length,
      inserted,
      updated,
      skipped,
      errors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to ingest scraped jobs', error: err.message });
  }
};

// FITUR SCRAPING LOKAL TELAH DIHAPUS (DEPRECATED)
// Scraping kini ditangani secara eksklusif oleh Python Microservice (jobmatch-scraper-cron)

// ─────────────────────────────────────────────────────────
// @desc    Recommend jobs based on uploaded CV (TF-IDF + Cosine Similarity)
// @route   POST /api/jobs/recommend
// ─────────────────────────────────────────────────────────
const recommendJobs = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // 1. Ekstrak teks dari PDF
    const pdfData = await pdfParse(req.file.buffer);
    const cvRawText = pdfData.text;
    if (!cvRawText || cvRawText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from PDF.' });
    }

    if (!isLikelyCV(cvRawText)) {
      return res.status(400).json({ message: 'Dokumen yang diunggah tidak terdeteksi sebagai CV.' });
    }

    // 2. Perkuat CV Input: ekstrak section skills/experience/summary
    const lines = cvRawText.split('\n').map(l => l.trim()).filter(Boolean);

    const skillLines   = [];
    const expLines     = [];
    const summaryLines = [];
    let currentSection = 'other';

    const skillHeaders   = /^(skill|keahlian|kemampuan|teknologi|tools|tech stack|kompetensi)/i;
    const expHeaders     = /^(pengalaman|experience|work experience|riwayat|pekerjaan|karir)/i;
    const summaryHeaders = /^(ringkasan|summary|profil|profile|objektif|objective|tentang)/i;

    lines.forEach(line => {
      if (skillHeaders.test(line))   { currentSection = 'skill'; return; }
      if (expHeaders.test(line))     { currentSection = 'exp'; return; }
      if (summaryHeaders.test(line)) { currentSection = 'summary'; return; }
      if (/^(pendidikan|education|referensi|reference)/i.test(line)) { currentSection = 'other'; return; }

      if (currentSection === 'skill' && line.length < 100)    skillLines.push(line);
      else if (currentSection === 'exp' && line.length < 200)  expLines.push(line);
      else if (currentSection === 'summary')                   summaryLines.push(line);
    });

    // 🔥 BOOST CV: skills spread 2x, lalu summary, experience, fulltext fallback
    const cvEnhancedText = [
      ...skillLines,     // skills individual
      ...skillLines,     // 🔥 skills diulang 2x untuk boost
      ...summaryLines,   // ringkasan/profil
      ...expLines,       // pengalaman kerja
      cvRawText          // fulltext sebagai fallback (pastikan semua term tercakup)
    ].join(' ');

    // 3. Normalisasi & tokenisasi CV
    const cvTokens = preprocessText(cvEnhancedText);
    
    // 3b. [BARU] Deteksi Kategori Utama dari CV
    const categoryInfo = detectCategory(cvTokens);
    console.log(`[CATEGORY] Detected: ${categoryInfo.category} (Hits: ${categoryInfo.hits}/${categoryInfo.totalHits})`);
    console.log(`[CATEGORY] Details:`, categoryInfo.details);

    console.log(`[CV] Total tokens after preprocess: ${cvTokens.length} | Skill lines: ${skillLines.length} | Exp lines: ${expLines.length}`);

    // 4. Load Vocabulary & IDF dari DB
    const vocab = await Vocabulary.getVocabulary();
    if (!vocab) {
      return res.status(500).json({ message: 'System not trained. Please run /api/jobs/scrape first.' });
    }
    console.log('Vocabulary loaded. Terms count:', vocab.terms.length);

    // 5. Vektorisasi CV menggunakan IDF global dari DB (applyBoost=true → skor CV & Job konsisten)
    const idf = vocab.idf instanceof Map ? Object.fromEntries(vocab.idf) : vocab.idf;
    const cvVector = createVector(cvTokens, idf, true);
    console.log('CV Vector terms:', Object.keys(cvVector).length);

    // DEBUG: Tampilkan top 10 terms CV dengan skor TF-IDF tertinggi
    const topCVTerms = Object.entries(cvVector)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([term, score]) => `${term}(${score.toFixed(3)})`)
      .join(', ');
    console.log(`[CV TERMS] Top 10 TF-IDF: ${topCVTerms}`);

    // 6. Tandai data expired, lalu fetch hanya jobs aktif yang belum expired
    await Job.expireOldJobs();
    const allJobs = await Job.find(Job.activeFilter()).select('+tfidfVector +processedText');
    
    console.log(`[INFO] Calculating similarity for CV: ${req.file.originalname} against ${allJobs.length} jobs...`);

    // 6a. [BARU] On-the-Fly TF-IDF Calculation untuk job baru dari Python
    const jobsToUpdate = [];
    allJobs.forEach(job => {
      let isVectorEmpty = true;
      
      if (job.tfidfVector) {
        if (job.tfidfVector instanceof Map && job.tfidfVector.size > 0) isVectorEmpty = false;
        else if (Array.isArray(job.tfidfVector) && job.tfidfVector.length > 0) isVectorEmpty = false;
        else if (typeof job.tfidfVector === 'object' && Object.keys(job.tfidfVector).length > 0 && !(job.tfidfVector instanceof Map)) isVectorEmpty = false;
      }

      if (isVectorEmpty) {
        console.log(`[ON-THE-FLY] Calculating TF-IDF for job: ${job.title} (${job._id})`);
        const skills = job.skills || [];
        const qualifications = job.qualifications || [];
        const jobText = [
          job.title || '', job.title || '', job.title || '',
          ...skills, ...skills, ...skills,
          ...qualifications, ...qualifications,
          job.description || ''
        ].join(' ');
        
        const jobTokens = preprocessText(jobText);
        const vector = createVector(jobTokens, idf, true);
        
        job.tfidfVector = vector;
        job.processedText = jobTokens;
        
        jobsToUpdate.push({
          updateOne: {
            filter: { _id: job._id },
            update: { $set: { tfidfVector: vector, processedText: jobTokens } }
          }
        });
      }
    });

    if (jobsToUpdate.length > 0) {
      console.log(`[ON-THE-FLY] Saving ${jobsToUpdate.length} computed vectors to database asynchronously...`);
      Job.bulkWrite(jobsToUpdate).catch(err => console.error('[ON-THE-FLY] BulkWrite Error:', err));
    }

    // 6b. [BARU] Domain Filtering: Hanya simpan job yang kategorinya cocok
    let jobs = allJobs;
    if (categoryInfo.category !== 'Other' && categoryInfo.hits > 0) {
      const matchJobs = allJobs.filter(j => normalizeCategory(j.category) === categoryInfo.category);
      // Jika ternyata ada pekerjaan di kategori tersebut, gunakan sebagai filter
      if (matchJobs.length > 0) {
        jobs = matchJobs;
        console.log(`[FILTER] Successfully filtered jobs from ${allJobs.length} to ${jobs.length} in category: ${categoryInfo.category}`);
      } else {
         console.log(`[FILTER] No jobs found for category ${categoryInfo.category}. Using all ${allJobs.length} jobs as fallback.`);
      }
    } else {
       console.log(`[FILTER] CV Category is unknown/Other. Comparing against all ${allJobs.length} jobs.`);
    }

    // 7. Hitung Cosine Similarity hanya untuk jobs yang sudah difilter
    const recommendations = jobs.map(job => ({
      jobId: job._id,
      title: job.title,
      company: job.company,
      category: displayCategory(job.category),
      location: job.location,
      type: job.type,
      description: job.description,
      qualifications: job.qualifications,
      skills: job.skills,
      source: job.source,
      url: job.url,
      postedAt: job.postedAt,
      expiredAt: job.expiredAt,
      durationDays: job.durationDays,
      status: job.status,
      createdByType: job.createdByType,
      similarityScore: calculateCosineSimilarity(cvVector, job.tfidfVector)
    }));

    // 8. Sort & ambil Top 10 yang paling relevan
    const sortedRecommendations = removeDuplicateJobs(recommendations
      .sort((a, b) => b.similarityScore - a.similarityScore)
    ).slice(0, 10);

    // 9. [BARU] Normalisasi Skor untuk Tampilan UI
    const topRecommendations = calculateFinalScore(sortedRecommendations);

    console.log('\n--- DEBUG: TOP RECOMMENDATIONS SCORE & TERMS ---');
    topRecommendations.forEach((r, idx) => {
      // Find original vector for this job
      const jobData = jobs.find(j => j._id.toString() === r.jobId.toString());
      const jobVectorObj = jobData.tfidfVector instanceof Map ? Object.fromEntries(jobData.tfidfVector) : jobData.tfidfVector;
      
      const topJobTerms = Object.entries(jobVectorObj || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([term, score]) => `${term}(${score.toFixed(3)})`)
        .join(', ');
        
      console.log(`[RANK ${idx + 1}] ${r.score} (Raw: ${(r.similarityScore * 100).toFixed(2)}%) | ${r.title} di ${r.company}`);
      console.log(`   └─ Top 10 Job Terms: ${topJobTerms}`);
    });
    console.log('------------------------------------------------\n');

    const topScores = topRecommendations.slice(0, 3)
      .map(r => `${r.title} (${r.score})`)
      .join(', ');
    console.log(`[RECOMMEND] Vocab hits: ${Object.keys(cvVector).length} | Top 3: ${topScores}`);

    res.json(topRecommendations);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get job by ID
// @route   GET /api/jobs/:id
// ─────────────────────────────────────────────────────────
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get Admin Dashboard Stats
// @route   GET /api/jobs/admin/stats
// ─────────────────────────────────────────────────────────
const getAdminStats = async (req, res) => {
  try {
    await Job.expireOldJobs();

    const [
      totalJobs,
      totalActive,
      totalExpired,
      totalDisplayedJobList,
      totalScraperJobs,
      totalCompanyJobs,
      totalCompanies,
      totalApplications,
      latestScraperJob,
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments(getActiveJobsQuery()),
      Job.countDocuments(getExpiredJobsQuery()),
      Job.find(getActiveJobsQuery()).sort({ createdAt: -1 }).lean().then((jobs) => removeDuplicateJobs(jobs)),
      Job.countDocuments({ createdByType: 'scraper' }),
      Job.countDocuments({ createdByType: 'company' }),
      Company.countDocuments(),
      Application.countDocuments(),
      Job.findOne({ createdByType: 'scraper' }).sort({ updatedAt: -1 }).select('updatedAt').lean(),
    ]);
    const lastScraperUpdate = latestScraperJob ? latestScraperJob.updatedAt : null;
    
    // Format category data for Recharts after normalization
    const categoryData = buildCategoryDataFromJobs(totalDisplayedJobList);

    // Get recent jobs (last 10)
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(10);

    // Last scrape time (latest job created at)
    const latestJob = await Job.findOne().sort({ createdAt: -1 });
    const lastScrape = latestJob ? latestJob.createdAt : null;

    res.json({
      totalJobs,
      totalActive,
      totalExpired,
      totalDisplayedJobs: totalDisplayedJobList.length,
      totalScraperJobs,
      totalCompanyJobs,
      totalCompanies,
      totalApplications,
      lastScraperUpdate,
      categoryData,
      recentJobs: recentJobs.map(normalizeJobForResponse),
      lastScrape,
      totalCategories: categoryData.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Delete job
// @route   DELETE /api/jobs/:id
// ─────────────────────────────────────────────────────────
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllJobs,
  getAdminJobs,
  getAdminJobStats,
  createJob,
  updateAdminJobStatus,
  ingestScrapedJobs,
  recommendJobs,
  getJobById,
  getAdminStats,
  deleteJob
};
