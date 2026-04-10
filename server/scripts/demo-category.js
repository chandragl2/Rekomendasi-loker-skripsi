/**
 * demo-category.js — Demo Domain Filtering + TF-IDF
 *
 * Script ini menguji:
 * 1. Preprocessing yg mendukung multi-domain
 * 2. Deteksi kategori CV (Domain Filtering)
 * 3. Filter pekerjaan yang tidak se-kategori
 * 4. Hitung TF-IDF & Cosine Similarity hanya pada kandidat pekerjaan tersisa
 */

const preprocessText = require('../utils/preprocess');
const { detectCategory } = require('../utils/category');
const { buildVocabulary, createVector, SKILL_BOOST_MULTIPLIER } = require('../utils/tfidf');
const calculateCosineSimilarity = require('../utils/cosineSimilarity');

// ═══════════════════════════════════════════════════════════════════
//  TEST CASES: CV DARI BERBAGAI DOMAIN
// ═══════════════════════════════════════════════════════════════════
const sampleCVs = [
  {
    name: 'Budi (Akuntan)',
    text: `Pengalaman 5 tahun di bidang finance dan akuntansi. Mampu menyusun laporan pajak,
rekonsiliasi bank, dan audit keuangan. Terbiasa menggunakan Excel dan software accounting.`
  },
  {
    name: 'Chandra (IT Fullstack)',
    text: `Fullstack developer dengan keahlian HTML, CSS, JavaScript, React, dan Node.js.
Menguasai MongoDB dan Express. Pengalaman integrasi REST API dan Git.`
  },
  {
    name: 'Siti (Barista)',
    text: `Pengalaman sebagai barista dan crew store di coffee shop. Bisa membuat latte
dan berbagai minuman. Terbiasa melayani customer di restaurant.`
  }
];

// ═══════════════════════════════════════════════════════════════════
//  DATA PEKERJAAN (BERBAGAI KATEGORI)
// ═══════════════════════════════════════════════════════════════════
const sampleJobs = [
  { id: 1, title: 'Frontend Developer', category: 'Engineering', desc: 'Butuh React, JavaScript, HTML, CSS.' },
  { id: 2, title: 'Node.js Backend Dev', category: 'Engineering', desc: 'Backend pakai Node.js, Express, MongoDB, API.' },
  { id: 3, title: 'Junior Accountant', category: 'Finance', desc: 'Menyusun laporan pajak, akuntansi, finance, audit.' },
  { id: 4, title: 'Finance Assistant', category: 'Finance', desc: 'Membantu laporan keuangan dan rekonsiliasi excel.' },
  { id: 5, title: 'Head Barista', category: 'Hospitality', desc: 'Dibutuhkan barista, bisa latte art, cafe, fnb, coffee.' },
  { id: 6, title: 'Software Engineer', category: 'Engineering', desc: 'Bisa fullstack React dan Node.js, pengalaman 2 tahun.' },
];

function runDemo() {
  console.log('\n' + '═'.repeat(70));
  console.log('  DEMO DOMAIN FILTERING + TF-IDF');
  console.log('═'.repeat(70));

  // 1. Prepare job tokens & Build Vocabulary
  const jobsProcessed = sampleJobs.map(job => {
    const jobText = `${job.title} ${job.title} ${job.desc}`; 
    return { ...job, tokens: preprocessText(jobText) };
  });

  const allDocsTokens = jobsProcessed.map(j => j.tokens);
  
  // Note: For realistic IDF, we pass all domain texts into vocabulary builder.
  const { terms, idf } = buildVocabulary(allDocsTokens);

  // Vektorisasi semua jobs
  const jobVectors = jobsProcessed.map(job => ({
    ...job,
    vector: createVector(job.tokens, idf, true)
  }));


  // 2. Uji tiap CV
  sampleCVs.forEach((cv, idx) => {
    console.log('\n' + '─'.repeat(70));
    console.log(`TEST CV #${idx + 1}: ${cv.name}`);
    console.log('─'.repeat(70));

    // A. Preprocess
    const cvTokens = preprocessText(cv.text);
    console.log(`[1] CV Tokens: ${cvTokens.slice(0, 10).join(', ')}...`);

    // B. Detect Category
    const categoryMatch = detectCategory(cvTokens);
    console.log(`[2] Kategori Terdeteksi: ${categoryMatch.category}`);
    console.log(`    Detail Hits:`, categoryMatch.details);

    // C. Domain Filtering
    const filteredJobs = jobVectors.filter(j => j.category === categoryMatch.category);
    console.log(`[3] Memfilter Lowongan: Tersisa ${filteredJobs.length} lowongan (dari total ${sampleJobs.length}).`);

    // D. Cosine Similarity (hanya pada lowongan yang lolos filter)
    console.log(`[4] Menghitung TF-IDF Similarity:`);
    const cvVector = createVector(cvTokens, idf, true);

    const recommendations = filteredJobs.map(job => ({
      ...job,
      score: calculateCosineSimilarity(cvVector, job.vector)
    })).sort((a,b) => b.score - a.score);

    recommendations.forEach((r, i) => {
      const pct = (r.score * 100).toFixed(2);
      console.log(`    Rank ${i+1}. ${r.title} (${pct}%)`);
    });

    if(filteredJobs.length === 0) {
      console.log(`    > Tidak ada lowongan di kategori ${categoryMatch.category}.`);
    }

  });
  console.log('\n' + '═'.repeat(70));
}

runDemo();
