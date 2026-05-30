/**
 * category.js — Domain Filtering / Category Detection
 *
 * Menganalisis token dari CV untuk menentukan kategori utama
 * bidang pekerjaan. Kategori yang dihasilkan akan digunakan
 * untuk memfilter data lowongan SEBELUM proses similarity TF-IDF.
 */

// Mapping Kategori ke daftar keywords pembobot
// Kunci utama diselaraskan dengan kategori di cleaner.js
const STANDARD_CATEGORIES = [
  'Engineering & IT',
  'Data & AI',
  'Design & Creative',
  'Marketing & Growth',
  'Finance & Accounting',
  'Operations & Supply Chain',
  'Sales & Business Development',
  'Healthcare & Medical',
  'Product & Project',
  'Human Resources',
  'Education & Others',
  'Other',
];

const CATEGORY_ALIAS_MAP = {
  'engineering & it': 'Engineering & IT',
  engineering: 'Engineering & IT',
  'it & software': 'Engineering & IT',
  it: 'Engineering & IT',

  'data & ai': 'Data & AI',
  data: 'Data & AI',
  'data science': 'Data & AI',

  'design & creative': 'Design & Creative',
  design: 'Design & Creative',
  creative: 'Design & Creative',

  'marketing & growth': 'Marketing & Growth',
  marketing: 'Marketing & Growth',

  'finance & accounting': 'Finance & Accounting',
  finance: 'Finance & Accounting',
  accounting: 'Finance & Accounting',

  'operations & supply chain': 'Operations & Supply Chain',
  'operations & supply': 'Operations & Supply Chain',
  operations: 'Operations & Supply Chain',
  'supply chain': 'Operations & Supply Chain',

  'sales & business development': 'Sales & Business Development',
  sales: 'Sales & Business Development',
  'business dev': 'Sales & Business Development',
  'business development': 'Sales & Business Development',

  'healthcare & medical': 'Healthcare & Medical',
  healthcare: 'Healthcare & Medical',
  medical: 'Healthcare & Medical',

  'product & project': 'Product & Project',
  product: 'Product & Project',
  project: 'Product & Project',

  'human resources': 'Human Resources',
  hr: 'Human Resources',

  'education & others': 'Education & Others',
  education: 'Education & Others',

  lainnya: 'Other',
  other: 'Other',
  miscellaneous: 'Other',
  misc: 'Other',
  legal: 'Other',
  hospitality: 'Other',
  'retail & crew outlet': 'Other',
};

const CATEGORY_DISPLAY_MAP = {
  'Education & Others': 'Education',
  Other: 'Miscellaneous',
};

const CATEGORY_EXACT_ALIASES = {
  'Engineering & IT': ['Engineering', 'IT & Software', 'IT'],
  'Data & AI': ['Data', 'Data Science'],
  'Design & Creative': ['Design', 'Creative'],
  'Marketing & Growth': ['Marketing'],
  'Finance & Accounting': ['Finance', 'Accounting'],
  'Operations & Supply Chain': ['Operations & Supply', 'Operations', 'Supply Chain'],
  'Sales & Business Development': ['Sales', 'Business Dev', 'Business Development'],
  'Healthcare & Medical': ['Healthcare', 'Medical'],
  'Product & Project': ['Product', 'Project'],
  'Human Resources': ['HR', 'Human Resources'],
  'Education & Others': ['Education'],
  Other: ['Lainnya', 'Other', 'Miscellaneous', 'Misc', 'Legal', 'Hospitality', 'Retail & Crew Outlet'],
};

const normalizeCategory = (category) => {
  if (!category || typeof category !== 'string') return 'Other';
  const key = category.trim().toLowerCase();
  return CATEGORY_ALIAS_MAP[key] || category.trim();
};

const displayCategory = (category) => {
  const normalized = normalizeCategory(category);
  return CATEGORY_DISPLAY_MAP[normalized] || normalized;
};

const getCategoryAliases = (standardCategory) => {
  const normalized = normalizeCategory(standardCategory);
  const aliases = Object.entries(CATEGORY_ALIAS_MAP)
    .filter(([, value]) => value === normalized)
    .map(([alias]) => alias);

  return [
    ...new Set([
      normalized,
      ...(CATEGORY_EXACT_ALIASES[normalized] || []),
      ...aliases,
      ...aliases.map(alias => alias.replace(/\b\w/g, c => c.toUpperCase())),
    ])
  ];
};

const CATEGORY_KEYWORDS = {
  'Engineering & IT': [
    'programmer', 'developer', 'software engineer', 'web developer', 'frontend', 'backend',
    'fullstack', 'react js', 'node js', 'express js', 'mongodb', 'postgresql', 'java developer',
    'python developer', 'php developer', 'laravel', 'rest api', 'mobile developer',
    'android developer', 'ios developer', 'flutter', 'react native', 'devops', 'docker',
    'github', 'konfigurasi jaringan', 'network engineer', 'aws', 'cloud computing', 'it support'
  ],
  'Data & AI': [
    'data analyst', 'data scientist', 'machine learning', 'artificial intelligence', 'ai engineer',
    'data model', 'statistik', 'data engineer', 'pandas', 'numpy', 'sql query', 'tableau',
    'power bi', 'data dashboard', 'etl', 'big data', 'predictive modeling'
  ],
  'Product & Project': [
    'product manager', 'scrum master', 'agile', 'product owner', 'project manager', 'project planning'
  ],
  'Design & Creative': [
    'ui/ux', 'ui designer', 'ux designer', 'graphic designer', 'desain grafis', 'illustrator',
    'photoshop', 'figma', 'coreldraw', 'visual art', 'animator', 'video editor', 'creative director',
    'motion graphic'
  ],
  'Marketing & Growth': [
    'digital marketing', 'pemasaran digital', 'seo specialist', 'sem specialist', 'branding',
    'brand manager', 'marketing campaign', 'content creator', 'social media specialist', 
    'digital ads', 'promosi digital', 'growth hacker', 'market research'
  ],
  'Sales & Business Development': [
    'account executive', 'sales marketing', 'canvasser', 'tenaga penjual',
    'b2b sales', 'b2c sales', 'telemarketing', 'business development', 'bd manager'
  ],
  'Finance & Accounting': [
    'finance manager', 'staf akuntansi', 'akuntan', 'konsultan pajak', 'laporan keuangan', 
    'internal audit', 'tax consultant', 'treasury', 'budgeting', 'rekonsiliasi', 
    'pembukuan', 'general ledger', 'staff payroll', 'invoice', 'analis ekonomi', 
    'perbankan', 'bank teller', 'accounting staff'
  ],
  'Human Resources': [
    'hr generalist', 'human resource', 'recruiter', 'talent acquisition', 'hr admin', 
    'people ops', 'hr manager'
  ],
  'Operations & Supply Chain': [
    'admin operasional', 'staf administrasi', 'staff arsip', 'data entry', 'sekretaris', 
    'supply chain', 'staf logistik', 'warehouse admin', 'kepala gudang', 'purchasing',
    'pengadaan barang', 'inventory control', 'dokumen kontrol'
  ],
  'Retail & Crew Outlet': [
    'pramuniaga', 'staff outlet', 'penjaga toko', 'kasir toko', 'store crew', 'kepala toko'
  ],
  'Education & Others': [
    'guru', 'teacher', 'tutor', 'dosen', 'curriculum developer', 'school principal', 'trainer'
  ],
  'Healthcare & Medical': [
    'tenaga medis', 'dokter umum', 'perawat', 'bidan', 'apoteker', 'asisten apoteker',
    'farmasi', 'staf klinik', 'ahli gizi', 'nutritionist', 'analis laboratorium', 
    'healthcare', 'physiotherapist', 'radiografer', 'psikolog klinis', 'terapis'
  ]
};

/**
 * Deteksi kategori CV berdasarkan keyword matching
 * @param {string[]} tokens - Array token CV setelah di-preprocess
 * @returns {Object} { category: string, scores: Object }
 */
const detectCategory = (tokens) => {
  if (!tokens || tokens.length === 0) {
    return { category: 'Other', scores: {} };
  }

  // Gabungkan token menjadi teks untuk mencocokkan frasa (lebih dari 1 kata)
  const text = tokens.join(' ').toLowerCase();

  // Objek untuk menyimpan skor tiap kategori
  const scores = {};
  Object.keys(CATEGORY_KEYWORDS).forEach(cat => scores[cat] = 0);

  // Hitung kemunculan keyword per kategori menggunakan Regular Expression
  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    keywords.forEach(kw => {
      // Batasi dengan word boundary (\b) agar tidak mencocokkan sebagian kata
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      const matches = text.match(regex);
      if (matches) {
        scores[category] += matches.length;
      }
    });
  });

  // Cari kategori dengan skor tertinggi
  let maxScore = -1;
  let topCategory = 'Other'; // Fallback

  Object.entries(scores).forEach(([cat, score]) => {
    if (score > maxScore && score > 0) { // Minimal harus ada 1 temuan
      maxScore = score;
      topCategory = cat;
    }
  });

  // Tampilkan perhitungan persentase secara proporsional untuk debugging
  const totalHits = Object.values(scores).reduce((a, b) => a + b, 0);
  const debugScores = {};
  if (totalHits > 0) {
    Object.entries(scores).forEach(([cat, score]) => {
      if (score > 0) {
        debugScores[cat] = {
          hits: score,
          percentage: ((score / totalHits) * 100).toFixed(1) + '%'
        };
      }
    });
  }

  return {
    category: normalizeCategory(topCategory),
    hits: maxScore,
    totalHits,
    details: debugScores
  };
};

/**
 * [SARAN PEMBOBOTAN]
 * Deteksi kategori untuk Scraper (bisa digunakan di glintsScraper.js)
 * Memberikan bobot x5 untuk keyword yang ditemukan di Judul Lowongan.
 * 
 * @param {string} title - Judul lowongan
 * @param {string} description - Deskripsi lowongan
 * @returns {string} - Kategori yang terdeteksi
 */
const detectCategoryWithWeight = (title = '', description = '') => {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  
  const scores = {};
  Object.keys(CATEGORY_KEYWORDS).forEach(cat => scores[cat] = 0);

  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      
      // Bobot Judul: x5 (Prioritas tinggi karena judul biasanya sangat relevan)
      const titleMatches = titleLower.match(regex);
      if (titleMatches) {
        scores[category] += titleMatches.length * 5;
      }
      
      // Bobot Deskripsi: x1 (Prioritas rendah karena deskripsi bisa mengandung kata acak)
      const descMatches = descLower.match(regex);
      if (descMatches) {
        scores[category] += descMatches.length * 1;
      }
    });
  });

  let maxScore = 0;
  let topCategory = 'Other';
  
  Object.entries(scores).forEach(([cat, score]) => {
    if (score > maxScore) {
      maxScore = score;
      topCategory = cat;
    }
  });

  return normalizeCategory(topCategory);
};

module.exports = {
  detectCategory,
  detectCategoryWithWeight,
  normalizeCategory,
  displayCategory,
  getCategoryAliases,
  STANDARD_CATEGORIES,
  CATEGORY_KEYWORDS
};
