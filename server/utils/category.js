/**
 * category.js — Domain Filtering / Category Detection
 *
 * Menganalisis token dari CV untuk menentukan kategori utama
 * bidang pekerjaan. Kategori yang dihasilkan akan digunakan
 * untuk memfilter data lowongan SEBELUM proses similarity TF-IDF.
 */

// Mapping Kategori ke daftar keywords pembobot
// Kunci utama harus diselaraskan dengan kategori di cleaner.js
// (Engineering, Finance, Marketing, Operations, Hospitality, dll)
const CATEGORY_KEYWORDS = {
  'Engineering': [
    'programmer','developer','engineer','software','it','web','frontend','backend',
    'fullstack','html','css','javascript','react','node','nodejs','express',
    'mongodb','mysql','postgresql','java','python','php','laravel','api',
    'mobile','android','ios','flutter','reactnative','devops','docker',
    'git','github','konfigurasi','jaringan','network','aws','cloud'
  ],
  'Finance': [
    'finance','akuntansi','akuntan','keuangan','pajak','laporan','audit',
    'tax','treasury','budgeting','reconcile','rekonsiliasi','pembukuan',
    'ledger','payroll','invoice','tagihan','ekonomi','perbankan','bank',
    'teller','accounting','accountant'
  ],
  'Marketing': [
    'marketing','pemasaran','seo','sem','branding','brand','campaign',
    'content','konten','social','media','digital','ads','iklan','promosi',
    'sales','penjualan','b2b','b2c','telemarketing','market','research'
  ],
  'Operations': [ // Menggabungkan Operasional & Admin Umum
    'admin','administrasi','arsip','data','entry','sekretaris','operasional',
    'operation','supply','chain','logistik','warehouse','gudang','purchasing',
    'pengadaan','inventaris','inventory','excel','word','office','dokumen'
  ],
  'Data': [
    'data','analyst','scientist','machine','learning','ai','model','statistik',
    'statistics','python','pandas','numpy','sql','tableau','powerbi',
    'dashboard','etl','big','query','predictive'
  ],
  'Design': [
    'design','desain','ui','ux','graphic','grafis','illustrator','photoshop',
    'figma','sketch','coreldraw','visual','art','animator','video','editor'
  ],
  'Hospitality': [
    'waiter','waitress','barista','crew','store','fnb','food','beverage',
    'cafe','restaurant','hospitality','kitchen','cook','chef','restoran',
    'kasir','cashier','pelayan','pramusaji'
  ]
};

/**
 * Deteksi kategori CV berdasarkan keyword matching
 * @param {string[]} tokens - Array token CV setelah di-preprocess
 * @returns {Object} { category: string, scores: Object }
 */
const detectCategory = (tokens) => {
  if (!tokens || tokens.length === 0) {
    return { category: 'Lainnya', scores: {} };
  }

  // Objek untuk menyimpan skor tiap kategori
  const scores = {};
  Object.keys(CATEGORY_KEYWORDS).forEach(cat => scores[cat] = 0);

  // Hitung kemunculan keyword per kategori
  tokens.forEach(token => {
    Object.keys(CATEGORY_KEYWORDS).forEach(category => {
      if (CATEGORY_KEYWORDS[category].includes(token)) {
        scores[category] += 1;
      }
    });
  });

  // Cari kategori dengan skor tertinggi
  let maxScore = -1;
  let topCategory = 'Lainnya'; // Fallback

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
    category: topCategory,
    hits: maxScore,
    totalHits,
    details: debugScores
  };
};

module.exports = {
  detectCategory,
  CATEGORY_KEYWORDS
};
