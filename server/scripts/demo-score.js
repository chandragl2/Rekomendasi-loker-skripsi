/**
 * demo-score.js — Demo Normalisasi Skor Rekomendasi
 *
 * Menguji perubahan dari raw Cosine Similarity (angka kecil seperti 0.12)
 * menjadi persentase tampilan (UI Score) yang realistis (misal 70%).
 */

const calculateFinalScore = require('../utils/scoreNormalizer');

function runScoreDemo() {
  console.log('\n' + '═'.repeat(60));
  console.log('  DEMO NORMALISASI SKOR (COSINE SIMILARITY -> PERSEN)');
  console.log('═'.repeat(60) + '\n');

  // Input Data Mentah ("Raw Similarity" dari TF-IDF)
  // Perhatikan nilainya berada di ambang 0.05 hingga 0.17
  const inputResults = [
    { title: 'Frontend Developer di Tokopedia', similarityScore: 0.1754 },
    { title: 'React Developer di Gojek', similarityScore: 0.1421 },
    { title: 'Backend Node.js', similarityScore: 0.0910 },
    { title: 'UI/UX Designer', similarityScore: 0.0305 },
    { title: 'Akuntan Junior', similarityScore: 0.0000 }
  ];

  console.log(' SEBELUM NORMALISASI (Tampilan Asli TF-IDF Kosong):');
  console.log(' ----------------------------------------------------');
  inputResults.forEach(r => {
    // Jika dirubah ke persen secara lansung (dikalikan 100):
    const justMultiply = (r.similarityScore * 100).toFixed(1) + '%';
    console.log(` - ${r.title.padEnd(35)}: ${justMultiply} (Raw: ${r.similarityScore})`);
  });
  console.log('\n > Masalah: Tampilan ini membuat pengguna UI berpikir sistem');
  console.log('   gagal padahal ini normal dalam ruang vektor yang luas.\n');

  // Proses Normalisasi
  const outputResults = calculateFinalScore(inputResults);

  console.log('\n SESUDAH NORMALISASI (Tampilan UI Final):');
  console.log(' ----------------------------------------------------');
  outputResults.forEach(r => {
    console.log(` - ${r.title.padEnd(35)}: => [${r.score}]`);
  });
  console.log('\n > Solusi: Ranking tidak berubah, namun nilai tertinggi (0.17)');
  console.log('   dipatok menjadi batas atas (80%) secara aman!');
  console.log('\n' + '═'.repeat(60) + '\n');
}

runScoreDemo();
