const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    default: 'Jakarta, Indonesia'
  },
  type: {
    type: String,
    default: 'Penuh Waktu'
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  skills: {
    type: [String],
    default: [],
  },
  // Kualifikasi terstruktur (bullet list)
  qualifications: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  // Sumber data: 'Seed' | 'Glints' | dll
  source: {
    type: String,
    default: 'Seed',
  },
  // Store preprocessed tokens to avoid re-processing
  processedText: {
    type: [String],
    select: false, // Don't return by default
  },
  // Store the TF-IDF vector for this job
  tfidfVector: {
    type: Map,
    of: Number,
    select: false, // Don't return by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster searching
JobSchema.index({ title: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', JobSchema);

