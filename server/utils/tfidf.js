/**
 * TF-IDF Implementation (Improved)
 *
 * Improvements over basic version:
 * 1. Sublinear TF scaling: TF = 1 + log(count) instead of count/total.
 *    Prevents long documents from drowning out important low-frequency terms.
 * 2. Smoothed IDF: IDF = log((N+1)/(df+1)) + 1 (sklearn-style).
 *    Prevents common terms from getting IDF=0, and adds +1 base to keep
 *    ALL terms in the vocabulary useful.
 * 3. Skills boosting in jobController: skills are repeated before description
 *    so they have naturally higher TF weight.
 */

/**
 * Calculate Term Frequency (TF) for a document using sublinear scaling.
 * TF(t,d) = 1 + log(count(t,d))  if count > 0, else 0
 * This dampens the effect of very high-frequency terms.
 * @param {string[]} tokens
 * @returns {Object} Map of term -> tf score
 */
const calculateTF = (tokens) => {
  if (!tokens || tokens.length === 0) return {};

  // Count raw occurrences
  const termCounts = {};
  tokens.forEach(token => {
    termCounts[token] = (termCounts[token] || 0) + 1;
  });

  // Apply sublinear TF: 1 + log(count)
  const tf = {};
  for (const term in termCounts) {
    tf[term] = 1 + Math.log(termCounts[term]);
  }

  return tf;
};

/**
 * Calculate Smoothed IDF (sklearn / BM25-style).
 * IDF(t) = log((N + 1) / (df(t) + 1)) + 1
 *
 * Why smoothed?
 * - Standard log(N/df) gives IDF=0 for terms in ALL docs (useless).
 * - Adding +1 to numerator and denominator ensures no term is ever
 *   completely zeroed out.
 * - The final +1 ensures even very common terms still have IDF > 0.
 *
 * @param {string[][]} allDocsTokens
 * @returns {Object} Map of term -> idf score
 */
const calculateIDF = (allDocsTokens) => {
  const idf = {};
  const totalDocs = allDocsTokens.length;

  if (totalDocs === 0) return idf;

  // Count document frequency for each term
  const docCounts = {};
  allDocsTokens.forEach(tokens => {
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach(token => {
      docCounts[token] = (docCounts[token] || 0) + 1;
    });
  });

  // Smoothed IDF: log((N+1)/(df+1)) + 1
  for (const term in docCounts) {
    idf[term] = Math.log((totalDocs + 1) / (docCounts[term] + 1)) + 1;
  }

  return idf;
};

/**
 * Build Vocabulary from corpus
 * @param {string[][]} allDocsTokens
 * @returns {Object} { terms: string[], idf: Object }
 */
const buildVocabulary = (allDocsTokens) => {
  const uniqueTerms = new Set();
  allDocsTokens.forEach(tokens => {
    tokens.forEach(token => uniqueTerms.add(token));
  });

  const terms = Array.from(uniqueTerms).sort();
  const idf = calculateIDF(allDocsTokens);

  return { terms, idf };
};

/**
 * Create TF-IDF Vector for a document, then L2-normalize it.
 * L2 normalization makes cosine similarity equivalent to dot product,
 * AND removes document-length bias (short vs long docs are comparable).
 *
 * @param {string[]} tokens - Document tokens
 * @param {Object} idfModel - Global IDF map { term: score }
 * @returns {Object} L2-normalized vector { term: tfidf_score }
 */
const createVector = (tokens, idfModel) => {
  const tf = calculateTF(tokens);
  const rawVector = {};

  // Compute raw TF-IDF
  for (const term in tf) {
    if (idfModel[term] !== undefined) {
      rawVector[term] = tf[term] * idfModel[term];
    }
  }

  // L2 Normalization: divide each value by the vector's magnitude
  const magnitude = Math.sqrt(
    Object.values(rawVector).reduce((sum, val) => sum + val * val, 0)
  );

  if (magnitude === 0) return rawVector;

  const normalizedVector = {};
  for (const term in rawVector) {
    normalizedVector[term] = rawVector[term] / magnitude;
  }

  return normalizedVector;
};

module.exports = {
  calculateTF,
  calculateIDF,
  buildVocabulary,
  createVector
};
