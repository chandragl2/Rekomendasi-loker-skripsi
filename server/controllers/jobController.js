const Job = require('../models/Job');
const Vocabulary = require('../models/Vocabulary');
const preprocessText = require('../utils/preprocess');
const { buildVocabulary, createVector } = require('../utils/tfidf');
const calculateCosineSimilarity = require('../utils/cosineSimilarity');
const pdfParse = require('pdf-parse');
const scrapeGlints = require('../utils/scraper');
const { cleanJobs } = require('../utils/cleaner');
const fs = require('fs');
const path = require('path');

// Fallback Seed Data
const seedJobs = require('../data/seedJobs');

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

  // Vektorisasi & simpan semua jobs
  await Job.deleteMany({});
  const jobsToSave = processedJobs.map(job => ({
    ...job,
    tfidfVector: createVector(job.processedText, idf)
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
    const query = {};

    if (category && category !== 'Semua') query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { skills: { $regex: search, $options: 'i' } }
    ];

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      jobs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Seed jobs dari static data, Build Vocabulary, Vectorize
// @route   GET /api/jobs/scrape
// ─────────────────────────────────────────────────────────
const scrapeJobs = async (req, res) => {
  try {
    console.log('Loading seed data...');
    if (seedJobs.length === 0) {
      return res.status(500).json({ message: 'No jobs found to process.' });
    }

    const { terms, jobsToSave } = await buildAndSave(seedJobs);
    console.log(`Saved ${jobsToSave.length} jobs with TF-IDF vectors.`);

    res.json({
      message: 'Seed data processing complete',
      totalJobs: jobsToSave.length,
      vocabularySize: terms.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Real-time scraping dari Glints + gabung seed + rebuild TF-IDF
// @route   POST /api/jobs/scrape-realtime
// ─────────────────────────────────────────────────────────
const scrapeRealtime = async (req, res) => {
  try {
    // Gunakan 40 sebagai nilai default target pengambilan dokumen dari glints
    const maxJobs = parseInt(req.body?.maxJobs) || 40;
    console.log(`[REALTIME] Starting real-time scraping (target: ${maxJobs} jobs)...`);

    // 1. Scrape langsung dari Glints.com menggunakan Puppeteer
    console.log('[REALTIME] Launching Puppeteer → navigating to glints.com...');
    const scrapedJobs = await scrapeGlints(maxJobs);
    console.log(`[REALTIME] Glints returned ${scrapedJobs.length} jobs.`);

    // 2. Ambil jobs yang sebelumnya sudah ada di database (hasil scrape sebelumnya) agar menetap
    const existingDbJobs = await Job.find({ source: 'Glints' }).lean();
    console.log(`[REALTIME] Mempertahankan ${existingDbJobs.length} job hasil scraping sebelumnya.`);

    // 3. Gabung semua (Seed Data + Hasil Scrape Lama + Hasil Scrape Baru)
    const combinedJobs = [...seedJobs, ...existingDbJobs, ...scrapedJobs];

    // 4. buildAndSave sudah handle dedup via cleanJobs (title & company kembar akan dianggap 1)
    const { terms, jobsToSave } = await buildAndSave(combinedJobs);
    console.log(`[REALTIME] Done. Saved ${jobsToSave.length} total jobs, vocab: ${terms.length} terms.`);

    // 5. [BARU] Otomatis simpan hasil gabungan Database ke dalam file all_jobs.csv 
    // Agar user bisa mereview langsung di file fisik (karena data di MongoDB tidak terlihat tanpa GUI)
    try {
      const csvPath = path.join(__dirname, '../data/all_jobs.csv');
      let csvContent = 'ID,Title,Company,Location,Type,Category,Skills,Description,Created At\n';
      
      const dbAll = await Job.find({}).lean();
      dbAll.forEach(j => {
        const escapeCsv = (str) => `"${(str || '').toString().replace(/"/g, '""')}"`;
        const row = [
          j._id,
          escapeCsv(j.title),
          escapeCsv(j.company),
          escapeCsv(j.location),
          escapeCsv(j.type),
          escapeCsv(j.category),
          escapeCsv((j.skills || []).join('; ')),
          escapeCsv(j.description),
          j.createdAt || new Date().toISOString()
        ].join(',');
        csvContent += row + '\n';
      });
      fs.writeFileSync(csvPath, csvContent, 'utf-8');
      console.log(`[REALTIME] Berhasil menimpa data/all_jobs.csv dengan ${dbAll.length} job total.`);
    } catch (csvError) {
      console.error('[REALTIME] Gagal menulis ke all_jobs.csv:', csvError.message);
    }

    // 6. Hitung statistik kategori
    const categoryCounts = {};
    jobsToSave.forEach(j => {
      const cat = j.category || 'Lainnya';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    res.json({
      success: true,
      message: `Berhasil scraping ${scrapedJobs.length} lowongan dari Glints.com secara realtime!`,
      stats: {
        totalJobs: jobsToSave.length,
        seedJobs: seedJobs.length,
        scrapedFromGlints: jobsToSave.length - seedJobs.length, // total history jobs from Glints
        vocabularySize: terms.length,
        categories: categoryCounts,
        scrapedAt: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('[REALTIME] Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Real-time scraping gagal: ' + err.message
    });
  }
};

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
    console.log(`[CV] Total tokens: ${cvTokens.length} | Skill lines: ${skillLines.length} | Exp lines: ${expLines.length}`);

    // 4. Load Vocabulary & IDF dari DB
    const vocab = await Vocabulary.getVocabulary();
    if (!vocab) {
      return res.status(500).json({ message: 'System not trained. Please run /api/jobs/scrape first.' });
    }
    console.log('Vocabulary loaded. Terms count:', vocab.terms.length);

    // 5. Vektorisasi CV menggunakan IDF global dari DB
    const idf = vocab.idf instanceof Map ? Object.fromEntries(vocab.idf) : vocab.idf;
    const cvVector = createVector(cvTokens, idf);
    console.log('CV Vector terms:', Object.keys(cvVector).length);

    // DEBUG: Tampilkan top 10 terms CV dengan skor TF-IDF tertinggi
    const topCVTerms = Object.entries(cvVector)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([term, score]) => `${term}(${score.toFixed(3)})`)
      .join(', ');
    console.log(`[CV TERMS] Top 10 TF-IDF: ${topCVTerms}`);

    // 6. Fetch semua jobs dari DB
    const jobs = await Job.find({}).select('+tfidfVector');
    console.log(`Comparing against ${jobs.length} jobs...`);

    // 7. Hitung Cosine Similarity
    const recommendations = jobs.map(job => ({
      jobId: job._id,
      title: job.title,
      company: job.company,
      category: job.category,
      location: job.location,
      type: job.type,
      description: job.description,
      qualifications: job.qualifications,
      skills: job.skills,
      source: job.source,
      similarityScore: calculateCosineSimilarity(cvVector, job.tfidfVector)
    }));

    // 8. Sort & ambil Top 10 yang paling relevan
    const topRecommendations = recommendations
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 10);

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
        
      console.log(`[RANK ${idx + 1}] ${(r.similarityScore * 100).toFixed(2)}% | ${r.title} di ${r.company}`);
      console.log(`   └─ Top 10 Job Terms: ${topJobTerms}`);
    });
    console.log('------------------------------------------------\n');

    const topScores = topRecommendations.slice(0, 3)
      .map(r => `${r.title} (${(r.similarityScore * 100).toFixed(1)}%)`)
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

module.exports = {
  getAllJobs,
  scrapeJobs,
  scrapeRealtime,
  recommendJobs,
  getJobById
};
