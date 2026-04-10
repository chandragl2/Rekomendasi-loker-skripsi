/**
 * scoreNormalizer.js — Normalisasi Skor Rekomendasi
 *
 * Mengubah nilai Cosine Similarity mentah yang kecil (misal: 0.15)
 * menjadi persentase yang realistis dan ramah pengguna (misal: 75.3%)
 * tanpa mengubah urutan ranking.
 */

/**
 * Menghitung dan menormalisasi final score
 * 
 * Formula:
 * 1. maxSimilarity = nilai tertinggi dari seluruh kandidat
 * 2. normalized = similarity / maxSimilarity
 * 3. score = (normalized * 60) + 20
 * 
 * @param {Array} results - Array data lowongan dengan field 'similarityScore'
 * @returns {Array} Array hasil dengan field 'score' tambahan
 */
function calculateFinalScore(results) {
  if (!Array.isArray(results) || results.length === 0) return [];

  // Cari max similarity (hindari nilai 0 agar tidak error pembagian)
  const maxSimilarity = results.reduce(
    (max, r) => (r.similarityScore > max ? r.similarityScore : max),
    0.0001
  );

  return results.map(r => {
    // Default score jika similarity 0 adalah 0%
    let finalValue = 0;

    if (r.similarityScore > 0) {
      // 1. Normalisasi: membuat kandidat teratas mendapatkan nilai 1.0
      const normalized = Math.min(r.similarityScore / maxSimilarity, 1.0);

      // 2. Scaling realistis: rentang minimum batas bawah 20%, maximum 80%
      // (Untuk peringkat 1 yang normalized-nya 1.0, nilainya = (1 * 60) + 20 = 80%)
      finalValue = (normalized * 60) + 20;
      
      // Jika jarak CV sangat jelek, turunkan proporsional ke bawah 20 jika diperlukan
      // Akan tetapi dengan rumus di atas, batas minimum kandidat dengan similarity > 0 pasti 20%.
    }

    return {
      ...r,
      // Format 1 angka di belakang koma (misal: 75.3%)
      score: `${finalValue.toFixed(1)}%`
    };
  });
}

module.exports = calculateFinalScore;
