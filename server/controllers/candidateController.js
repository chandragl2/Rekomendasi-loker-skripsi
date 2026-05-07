const Candidate = require('../models/Candidate');
const preprocessText = require('../utils/preprocess');
const { createVector, buildVocabulary } = require('../utils/tfidf');
const calculateCosineSimilarity = require('../utils/cosineSimilarity');

/**
 * @desc    Get recommended candidates based on job description/requirement
 * @route   POST /api/candidates/recommend
 * @access  Public
 */
exports.getRecommendations = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    // 1. Fetch all candidates from MongoDB
    const candidates = await Candidate.find();

    if (candidates.length === 0) {
      return res.status(404).json({ message: 'No candidates found in database' });
    }

    // 2. Prepare corpus for TF-IDF
    // Combine 'keahlian' and 'pengalaman' for each candidate
    const candidateDocs = candidates.map(c => {
      // We can give higher weight to 'keahlian' by repeating it
      const textToProcess = `${c.keahlian} ${c.keahlian} ${c.pengalaman}`;
      return {
        id: c._id,
        tokens: preprocessText(textToProcess)
      };
    });

    // Also preprocess the input job description
    const jobTokens = preprocessText(jobDescription);

    // 3. Build Vocabulary and IDF from all documents (candidates + the query)
    const allTokens = candidateDocs.map(d => d.tokens).concat([jobTokens]);
    const { idf } = buildVocabulary(allTokens);

    // 4. Vectorize job description
    const jobVector = createVector(jobTokens, idf);

    // 5. Calculate Similarity for each candidate
    const recommendations = candidates.map((candidate, index) => {
      const candidateVector = createVector(candidateDocs[index].tokens, idf);
      const score = calculateCosineSimilarity(jobVector, candidateVector);

      return {
        _id: candidate._id,
        nama: candidate.nama,
        pendidikan: candidate.pendidikan,
        keahlian: candidate.keahlian,
        pengalaman: candidate.pengalaman,
        score: parseFloat((score * 100).toFixed(2)) // score in percentage
      };
    });

    // 6. Sort by score descending (Ranking)
    recommendations.sort((a, b) => b.score - a.score);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get all candidates
 * @route   GET /api/candidates
 * @access  Public
 */
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
