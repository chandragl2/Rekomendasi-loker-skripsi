const mongoose = require('mongoose');

const VocabularySchema = new mongoose.Schema({
  // Array of all unique terms in the corpus
  terms: {
    type: [String],
    default: [],
  },
  // Map of term -> IDF score
  idf: {
    type: Map,
    of: Number,
    default: {},
  },
  // Total number of documents used to build this vocabulary
  totalDocuments: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Singleton helper
VocabularySchema.statics.getVocabulary = async function () {
  const vocab = await this.findOne().sort({ createdAt: -1 });
  return vocab;
};

module.exports = mongoose.model('Vocabulary', VocabularySchema);
