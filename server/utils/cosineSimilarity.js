/**
 * cosineSimilarity.js — Cosine Similarity Calculator
 *
 * Menghitung kemiripan antara dua TF-IDF vektor.
 *
 * Formula:
 *   similarity(A,B) = (A · B) / (|A| × |B|)
 *
 * Karena vektor sudah di-L2-normalize di createVector(),
 * magnitude |A| dan |B| selalu = 1.
 * Sehingga similarity = dot product saja (lebih efisien).
 *
 * Rentang output: 0.0 (tidak mirip) hingga 1.0 (identik)
 */

/**
 * Calculate Cosine Similarity between two TF-IDF vectors
 * Mendukung plain Object dan Map (dari Mongoose)
 *
 * @param {Object|Map} vecA - Vector A (e.g., CV vector)
 * @param {Object|Map} vecB - Vector B (e.g., Job vector)
 * @returns {number} Similarity score 0.0 – 1.0
 */
const calculateCosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB) return 0;

  // Konversi Map → Object jika perlu (Mongoose menyimpan sebagai Map)
  const objA = vecA instanceof Map ? Object.fromEntries(vecA) : vecA;
  const objB = vecB instanceof Map ? Object.fromEntries(vecB) : vecB;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length === 0 || keysB.length === 0) return 0;

  // ─── Dot Product ───────────────────────────────────────────────────────
  // Hanya iterasi term yang ada di kedua vektor (intersection).
  // Pilih vektor terkecil sebagai iterator untuk efisiensi.
  let dotProduct = 0;
  const [smallKeys, smallObj, largeObj] =
    keysA.length < keysB.length
      ? [keysA, objA, objB]
      : [keysB, objB, objA];

  for (const term of smallKeys) {
    if (largeObj[term]) {
      dotProduct += smallObj[term] * largeObj[term];
    }
  }

  // ─── Magnitude ─────────────────────────────────────────────────────────
  // Jika vektor sudah di-L2-normalize (dari createVector), magnitude ≈ 1.0
  // Tetap dihitung di sini untuk keamanan jika ada vektor yang tidak ter-normalize
  const magA = Math.sqrt(Object.values(objA).reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(Object.values(objB).reduce((s, v) => s + v * v, 0));

  if (magA === 0 || magB === 0) return 0;

  const similarity = dotProduct / (magA * magB);

  // Clamp ke [0, 1] untuk menghindari floating-point error kecil
  return Math.min(1, Math.max(0, similarity));
};

module.exports = calculateCosineSimilarity;
