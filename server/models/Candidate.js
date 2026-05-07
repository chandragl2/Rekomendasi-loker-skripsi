const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  pendidikan: {
    type: String,
    required: true,
  },
  keahlian: {
    type: String, // Ini akan menjadi sumber data utama TF-IDF
    required: true,
  },
  pengalaman: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);
