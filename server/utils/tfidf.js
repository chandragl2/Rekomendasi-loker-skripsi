/**
 * tfidf.js — TF-IDF Implementation
 *
 * Improvements:
 * 1. Sublinear TF scaling: TF = 1 + log(count)
 * 2. Smoothed IDF (sklearn-style): IDF = log((N+1)/(df+1)) + 1
 * 3. L2 Normalization pada vektor
 * 4. Keyword Boosting (OPSIONAL): Kata-kata yang merupakan keyword
 *    utama dari suatu kategori dapat diberikan boost x1.5 untuk
 *    meningkatkan akurasi similarity di dalam satu domain.
 */

const { CATEGORY_KEYWORDS } = require('./category');

const KEYWORD_BOOST_MULTIPLIER = 1.5;

// Build Set untuk lookup O(1) apakah suatu term merupakan keyword
const ALL_DOMAIN_KEYWORDS = new Set();
Object.values(CATEGORY_KEYWORDS).forEach(wordList => {
  wordList.forEach(word => ALL_DOMAIN_KEYWORDS.add(word));
});

const isDomainKeyword = (term) => ALL_DOMAIN_KEYWORDS.has(term);

const calculateTF = (tokens) => {
  if (!tokens || tokens.length === 0) return {};

  const termCounts = {};
  tokens.forEach(token => {
    termCounts[token] = (termCounts[token] || 0) + 1;
  });

  const tf = {};
  for (const term in termCounts) {
    tf[term] = 1 + Math.log(termCounts[term]);
  }

  return tf;
};

const calculateIDF = (allDocsTokens) => {
  const idf = {};
  const totalDocs = allDocsTokens.length;
  if (totalDocs === 0) return idf;

  const docCounts = {};
  allDocsTokens.forEach(tokens => {
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach(token => {
      docCounts[token] = (docCounts[token] || 0) + 1;
    });
  });

  for (const term in docCounts) {
    idf[term] = Math.log((totalDocs + 1) / (docCounts[term] + 1)) + 1;
  }

  return idf;
};

const buildVocabulary = (allDocsTokens) => {
  const uniqueTerms = new Set();
  allDocsTokens.forEach(tokens => {
    tokens.forEach(token => uniqueTerms.add(token));
  });

  const terms = Array.from(uniqueTerms).sort();
  const idf   = calculateIDF(allDocsTokens);

  return { terms, idf };
};

const createVector = (tokens, idfModel, applyBoost = true) => {
  const tf       = calculateTF(tokens);
  const rawVector = {};

  for (const term in tf) {
    if (idfModel[term] !== undefined) {
      let score = tf[term] * idfModel[term];

      // Domain Keyword Boosting
      if (applyBoost && isDomainKeyword(term)) {
        score *= KEYWORD_BOOST_MULTIPLIER;
      }

      rawVector[term] = score;
    }
  }

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
  createVector,
  isDomainKeyword,
  KEYWORD_BOOST_MULTIPLIER,
};
