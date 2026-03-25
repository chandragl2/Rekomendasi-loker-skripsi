/**
 * cleaner.js — Pembersih dan strukturisasi data lowongan pekerjaan
 *
 * Tugasnya:
 * 1. Hapus duplikasi skill
 * 2. Bersihkan deskripsi dari pengulangan kata/kalimat berlebihan
 * 3. Pisahkan menjadi: description, qualifications, skills
 * 4. Hasilkan output yang rapi, profesional, tanpa spam kata
 */

// ─── Kamus noise words yang tidak informatif ───────────────
const NOISE_WORDS = new Set([
  'dan', 'atau', 'yang', 'untuk', 'dengan', 'pada', 'di', 'ke', 'dari',
  'ini', 'itu', 'adalah', 'akan', 'telah', 'sudah', 'bisa', 'dapat',
  'the', 'and', 'or', 'to', 'for', 'with', 'at', 'in', 'of', 'a', 'an',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had'
]);

// ─── Kalimat berulang yang sering muncul di data scraping ───
const REDUNDANT_PATTERNS = [
  /skill yang dibutuhkan\s*[:：]?\s*/gi,
  /posisi ini membutuhkan kandidat yang kompeten dan berpengalaman di bidangnya\.?/gi,
  /tipe\s*[:：]?\s*/gi,
  /lokasi\s*[:：]?\s*/gi,
  /di\s+[\w\s]+\.\s*lokasi\s*:/gi,
];

/**
 * Deduplikasi array string (case-insensitive, trim whitespace)
 * Pertahankan case asli dari kemunculan pertama
 * @param {string[]} arr
 * @returns {string[]}
 */
const deduplicateArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  return arr
    .map(s => (typeof s === 'string' ? s.trim() : ''))
    .filter(s => {
      if (!s || s.length < 2) return false;
      const key = s.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

/**
 * Bersihkan teks deskripsi dari noise dan pengulangan
 * @param {string} text
 * @returns {string}
 */
const cleanDescription = (text) => {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text;

  // Hapus pola redundant
  REDUNDANT_PATTERNS.forEach(pat => {
    cleaned = cleaned.replace(pat, ' ');
  });

  // Hilangkan spasi berlebihan dan newline ganda
  cleaned = cleaned
    .replace(/\s{2,}/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();

  // Deduplikasi kalimat (kalimat yang persis sama tidak ditampilkan dua kali)
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  const seenSentences = new Set();
  const uniqueSentences = sentences.filter(s => {
    const key = s.toLowerCase().trim();
    if (!key || seenSentences.has(key)) return false;
    seenSentences.add(key);
    return true;
  });

  return uniqueSentences.join(' ').trim();
};

/**
 * Extract qualifications dari deskripsi (kalimat yang mengandung kata kunci kualifikasi)
 * Hanya untuk job scraping — seed jobs sudah punya deskripsi bagus
 * @param {string} description
 * @returns {string[]}
 */
const extractQualifications = (description) => {
  if (!description) return [];

  const qualKeywords = [
    'minimal', 'pengalaman', 'dibutuhkan', 'diperlukan', 'berpengalaman',
    'sarjana', 'diploma', 's1', 's2', 'd3', 'gelar', 'sertifikat', 'sertifikasi',
    'required', 'experience', 'minimum', 'degree', 'bachelor', 'master',
    'kandidat', 'harus memiliki', 'wajib', 'mampu', 'kemampuan'
  ];

  const sentences = description.split(/[.!?\n]+/).map(s => s.trim()).filter(Boolean);
  const qualifications = sentences.filter(sentence => {
    const lower = sentence.toLowerCase();
    return qualKeywords.some(kw => lower.includes(kw));
  });

  return deduplicateArray(qualifications).slice(0, 6);
};

/**
 * Bersihkan dan strukturkan satu objek job dari hasil scraping
 * @param {Object} rawJob - Data job mentah
 * @returns {Object} - Job yang sudah bersih dan terstruktur
 */
const cleanJob = (rawJob) => {
  if (!rawJob) return null;

  // 1. Bersihkan title
  const title = (rawJob.title || '').trim().replace(/\s{2,}/g, ' ');

  // 2. Bersihkan company
  const company = (rawJob.company || 'Unknown Company').trim();

  // 3. Bersihkan location (ambil baris pertama saja)
  const location = (rawJob.location || 'Indonesia')
    .split('\n')[0]
    .trim()
    .replace(/\s{2,}/g, ' ');

  // 4. Bersihkan type
  const type = (rawJob.type || 'Penuh Waktu').trim();

  // 5. Deduplikasi skills
  const skills = deduplicateArray(rawJob.skills || [])
    .filter(s => s.length >= 2 && s.length <= 60)
    .slice(0, 10); // Maks 10 skill unik

  // 6. Bersihkan deskripsi dari pola noise
  let description = cleanDescription(rawJob.description || '');

  // Jika deskripsi terlalu pendek (hasil scraping sering cuma template), bangun yang lebih baik
  if (description.length < 80) {
    const skillList = skills.join(', ');
    description = `${title} di ${company}. Bertanggung jawab dalam posisi ini di lokasi ${location}.`
      + (skillList ? ` Skill yang diutamakan: ${skillList}.` : '');
  }

  // 7. Extract qualifications (untuk job dari scraping)
  const rawQualifications = rawJob.qualifications || [];
  const qualifications = rawQualifications.length > 0
    ? deduplicateArray(rawQualifications)
    : extractQualifications(description);

  // 8. Tetapkan kategori berdasarkan Title jika belum ada
  let category = rawJob.category;
  if (!category || category === 'Lainnya') {
    const t = title.toLowerCase();
    if (t.match(/engineer|developer|programmer|frontend|backend|fullstack|software|tech|it|web/)) category = 'Engineering';
    else if (t.match(/data|analyst|machine learning|ai|statistic|bi/)) category = 'Data';
    else if (t.match(/product|scrum|agile|owner|pm/)) category = 'Product';
    else if (t.match(/design|ui|ux|graphic|illustrator|creative|animator|art|video/)) category = 'Design';
    else if (t.match(/market|seo|social media|content|pr|brand|campaign/)) category = 'Marketing';
    else if (t.match(/sales|business development|account executive|sdr|b2b|telesales/)) category = 'Sales';
    else if (t.match(/finance|accountant|tax|audit|treasury|controller/)) category = 'Finance';
    else if (t.match(/hr|human resource|recruiter|talent|payroll/)) category = 'HR';
    else if (t.match(/health|medical|doctor|nurse|clinical|pharm/)) category = 'Healthcare';
    else if (t.match(/teacher|tutor|education|curriculum|school/)) category = 'Education';
    else if (t.match(/legal|law|counsel|lawyer|compliance|paralegal/)) category = 'Legal';
    else if (t.match(/operation|supply chain|logistics|warehouse|procurement|facilities/)) category = 'Operations';
    else category = 'Lainnya';
  }
  const source = rawJob.source || 'Seed';

  return {
    title,
    company,
    location,
    type,
    category,
    description,
    qualifications,
    skills,
    source
  };
};

/**
 * Bersihkan array of jobs (batch cleaning)
 * @param {Object[]} rawJobs
 * @returns {Object[]}
 */
const cleanJobs = (rawJobs) => {
  if (!Array.isArray(rawJobs)) return [];

  // Bersihkan setiap job
  const cleaned = rawJobs
    .map(cleanJob)
    .filter(j => j && j.title && j.title.length > 2);

  // Deduplication antar job (berdasarkan title + company)
  const seen = new Set();
  return cleaned.filter(job => {
    const key = `${job.title.toLowerCase()}_${job.company.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

module.exports = { cleanJob, cleanJobs, deduplicateArray, cleanDescription };
