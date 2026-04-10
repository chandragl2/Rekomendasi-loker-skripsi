/**
 * demo-tfidf.js — Demo Lengkap Sistem TF-IDF + Cosine Similarity
 *
 * Jalankan dengan: node server/scripts/demo-tfidf.js
 *
 * Script ini memperlihatkan:
 * 1. Token sebelum vs sesudah filtering (untuk debugging & skripsi)
 * 2. Proses TF-IDF dengan skill boosting
 * 3. Cosine Similarity antara CV dan data lowongan
 * 4. Top 5 rekomendasi dengan skor similarity (%)
 */

const preprocessText = require('../utils/preprocess');
const { buildVocabulary, createVector, SKILL_BOOST_MULTIPLIER } = require('../utils/tfidf');
const calculateCosineSimilarity = require('../utils/cosineSimilarity');

// ═══════════════════════════════════════════════════════════════════
//  CONTOH INPUT: CV PENGGUNA
// ═══════════════════════════════════════════════════════════════════
const sampleCV = `
Chandra Gulo
Frontend Developer | 2 tahun pengalaman

RINGKASAN
Saya adalah seorang developer dengan komunikasi yang baik, teamwork yang solid,
dan semangat tinggi. Berpengalaman dalam membangun aplikasi web modern.

SKILL TEKNIS
HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, Git, REST API,
Tailwind CSS, GitHub, TypeScript, Next.js, Redux

PENGALAMAN KERJA
Frontend Developer — PT. Teknologi Maju (2022-2024)
- Membangun tampilan UI menggunakan React dan Tailwind CSS
- Mengintegrasikan REST API dengan Express.js dan MongoDB
- Berkolaborasi dengan tim backend untuk integrasi sistem
- Melayani pelanggan dengan pelayanan prima dan komunikasi yang baik
- Teamwork yang solid dalam lingkungan kerja yang dinamis

PENDIDIKAN
S1 Teknik Informatika — Universitas XYZ (2018-2022)
`;

// ═══════════════════════════════════════════════════════════════════
//  CONTOH DATA LOWONGAN
// ═══════════════════════════════════════════════════════════════════
const sampleJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Tokopedia',
    description: `Kami mencari Frontend Developer yang berpengalaman dengan React dan TypeScript.
      Keahlian: HTML, CSS, JavaScript, React, TypeScript, Next.js, Git, REST API, Tailwind.
      Tanggung jawab: membangun UI modern, integrasi API, optimasi performa web.
      Pengalaman minimal 2 tahun dengan React dan ekosistem JavaScript modern.`
  },
  {
    id: 2,
    title: 'Backend Developer Node.js',
    company: 'Gojek',
    description: `Posisi Backend Developer dengan stack Node.js dan Express.
      Skill: Node.js, Express, MongoDB, PostgreSQL, Redis, Docker, REST API, Git, GitHub.
      Bertanggung jawab membangun microservice scalable dan API yang handal.
      Familiar dengan Docker, Kubernetes, dan AWS adalah nilai tambah.`
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'Shopee',
    description: `Data Scientist untuk tim analitik. Stack: Python, Pandas, NumPy, TensorFlow,
      Scikit-learn, SQL, PostgreSQL, Jupyter, Matplotlib, Tableau.
      Pengalaman machine learning, NLP, dan statistik diperlukan.
      Familiar dengan BigQuery dan Spark adalah nilai tambah.`
  },
  {
    id: 4,
    title: 'Customer Service Representative',
    company: 'Bank BCA',
    description: `Mencari kandidat untuk posisi customer service. Melayani pelanggan,
      komunikasi yang baik, teamwork, dan pelayanan prima. Ramah, sopan, empati tinggi.
      Mampu menggunakan Microsoft Office, Word, Excel untuk administrasi.
      Gaji kompetitif, benefit menarik, bonus prestasi.`
  },
  {
    id: 5,
    title: 'Fullstack Developer React + Node',
    company: 'Bukalapak',
    description: `Fullstack Developer dengan keahlian React dan Node.js.
      Tech stack: JavaScript, TypeScript, React, Next.js, Node.js, Express,
      MongoDB, PostgreSQL, Git, Docker, REST API, GraphQL.
      Pengalaman 3 tahun di full-stack web development.`
  },
  {
    id: 6,
    title: 'UI/UX Designer',
    company: 'Grab',
    description: `UI/UX Designer untuk produk mobile. Keahlian: Figma, Sketch, Adobe XD,
      Prototyping, User Research, Design System, CSS, HTML dasar.
      Membuat desain antarmuka yang intuitif dan responsive.
      Komunikasi desain yang baik dengan engineer dan stakeholder.`
  },
  {
    id: 7,
    title: 'DevOps Engineer',
    company: 'Traveloka',
    description: `DevOps Engineer dengan fokus cloud infrastructure. Skill: Docker, Kubernetes,
      AWS, GCP, Terraform, Ansible, Jenkins, CI/CD, Linux, Bash, Nginx, Redis.
      Merancang pipeline CI/CD dan memantau sistem produksi di AWS.`
  },
];

// ═══════════════════════════════════════════════════════════════════
//  MAIN DEMO
// ═══════════════════════════════════════════════════════════════════
function runDemo() {
  console.log('\n' + '═'.repeat(70));
  console.log('  DEMO SISTEM TF-IDF + COSINE SIMILARITY — JOB RECOMMENDATION');
  console.log('═'.repeat(70));

  // ─── STEP 1: Preprocessing CV dengan mode DEBUG ───────────────────────
  console.log('\n' + '─'.repeat(70));
  console.log('STEP 1: PREPROCESSING CV');
  console.log('─'.repeat(70));

  const cvTokens = preprocessText(sampleCV, { debug: true });
  console.log(`\n✅ Final CV tokens (${cvTokens.length}):`, cvTokens);

  // ─── STEP 2: Preprocessing semua lowongan ────────────────────────────
  console.log('\n' + '─'.repeat(70));
  console.log('STEP 2: PREPROCESSING LOWONGAN');
  console.log('─'.repeat(70));

  const jobsProcessed = sampleJobs.map(job => {
    const jobText = `${job.title} ${job.title} ${job.description}`; // title 2x untuk boost
    const tokens  = preprocessText(jobText);
    console.log(`\n[${job.id}] ${job.title} (${job.company})`);
    console.log(`    Tokens: [${tokens.join(', ')}]`);
    return { ...job, tokens };
  });

  // ─── STEP 3: Build TF-IDF Vocabulary ─────────────────────────────────
  console.log('\n' + '─'.repeat(70));
  console.log('STEP 3: BUILD TF-IDF VOCABULARY');
  console.log('─'.repeat(70));

  const allDocsTokens = [cvTokens, ...jobsProcessed.map(j => j.tokens)];
  const { terms, idf } = buildVocabulary(allDocsTokens);

  console.log(`\nVocabulary size: ${terms.length} terms`);
  console.log(`Skill boost multiplier: x${SKILL_BOOST_MULTIPLIER}`);
  console.log('\nSample IDF values:');
  const sampleTerms = ['reactjs', 'javascript', 'nodejs', 'python', 'mongodb', 'html', 'css'];
  sampleTerms.forEach(t => {
    if (idf[t]) console.log(`  ${t.padEnd(15)} → IDF: ${idf[t].toFixed(4)}`);
  });

  // ─── STEP 4: Vektorisasi ──────────────────────────────────────────────
  console.log('\n' + '─'.repeat(70));
  console.log('STEP 4: VEKTORISASI TF-IDF');
  console.log('─'.repeat(70));

  const cvVector = createVector(cvTokens, idf, true);  // true = apply boost

  console.log('\nTop 10 terms CV (TF-IDF + BOOST):');
  Object.entries(cvVector)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([term, score]) => {
      console.log(`  ${term.padEnd(20)} → ${score.toFixed(4)}`);
    });

  const jobVectors = jobsProcessed.map(job => ({
    ...job,
    vector: createVector(job.tokens, idf, true)
  }));

  // ─── STEP 5: Cosine Similarity ────────────────────────────────────────
  console.log('\n' + '─'.repeat(70));
  console.log('STEP 5: COSINE SIMILARITY (CV vs Semua Lowongan)');
  console.log('─'.repeat(70));

  const results = jobVectors.map(job => ({
    id       : job.id,
    title    : job.title,
    company  : job.company,
    score    : calculateCosineSimilarity(cvVector, job.vector),
    topTerms : Object.entries(job.vector)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t]) => t),
  }));

  // ─── STEP 6: Top 5 Rekomendasi ───────────────────────────────────────
  const sorted = results.sort((a, b) => b.score - a.score);

  console.log('\n' + '═'.repeat(70));
  console.log('  TOP 5 REKOMENDASI LOWONGAN');
  console.log('═'.repeat(70));

  sorted.slice(0, 5).forEach((r, i) => {
    const pct   = (r.score * 100).toFixed(2);
    const bar   = '█'.repeat(Math.round(r.score * 30)).padEnd(30, '░');
    console.log(`\n  RANK ${i + 1}: ${r.title} — ${r.company}`);
    console.log(`  Similarity : ${bar} ${pct}%`);
    console.log(`  Top Terms  : ${r.topTerms.join(', ')}`);
  });

  // ─── STEP 7: Semua skor (termasuk yang tidak relevan) ────────────────
  console.log('\n' + '─'.repeat(70));
  console.log('ALL SCORES (terurut descending):');
  console.log('─'.repeat(70));
  sorted.forEach(r => {
    const pct = (r.score * 100).toFixed(2);
    console.log(`  [${String(pct).padStart(6)}%]  ${r.title} — ${r.company}`);
  });

  console.log('\n' + '═'.repeat(70));
  console.log('  DEMO SELESAI');
  console.log('═'.repeat(70) + '\n');
}

runDemo();
