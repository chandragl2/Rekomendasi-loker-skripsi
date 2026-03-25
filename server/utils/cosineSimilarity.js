/**
 * Calculate Cosine Similarity between two TF-IDF vectors
 * @param {Map<string, number> | Object} vecA - Vector A (e.g., CV)
 * @param {Map<string, number> | Object} vecB - Vector B (e.g., Job)
 * @returns {number} Similarity score (0 to 1)
 */
const calculateCosineSimilarity = (vecA, vecB) => {
    if (!vecA || !vecB) return 0;

    // Convert Map to Object if needed, or handle both
    const objA = vecA instanceof Map ? Object.fromEntries(vecA) : vecA;
    const objB = vecB instanceof Map ? Object.fromEntries(vecB) : vecB; // Fix: handles Mongoose Maps
  
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
  
    if (keysA.length === 0 || keysB.length === 0) return 0;
  
    // Identify intersection of terms (optimization: only iterate overlapping terms)
    // Actually, dot product is sum(Ai * Bi). We only need terms present in both.
    let dotProduct = 0;
    
    // Iterate over the smaller vector for efficiency
    const sourceKeys = keysA.length < keysB.length ? keysA : keysB;
    const targetObj = keysA.length < keysB.length ? objB : objA;
    const sourceObj = keysA.length < keysB.length ? objA : objB;
  
    for (const term of sourceKeys) {
      if (targetObj[term]) {
        dotProduct += sourceObj[term] * targetObj[term];
      }
    }
  
    // Calculate Magnitude
    // |A| = sqrt(sum(Ai^2))
    const magnitudeA = Math.sqrt(
      Object.values(objA).reduce((sum, val) => sum + val * val, 0)
    );
  
    const magnitudeB = Math.sqrt(
      Object.values(objB).reduce((sum, val) => sum + val * val, 0)
    );
  
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
    return dotProduct / (magnitudeA * magnitudeB);
  };
  
  module.exports = calculateCosineSimilarity;
