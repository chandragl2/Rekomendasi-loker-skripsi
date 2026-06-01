const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  },
  candidateName: {
    type: String,
    required: true,
    trim: true,
  },
  candidateEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  candidatePhone: {
    type: String,
    required: true,
    trim: true,
  },
  cvText: {
    type: String,
    default: '',
  },
  cvFileName: {
    type: String,
    default: '',
    trim: true,
  },
  similarityScore: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
    index: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ApplicationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

ApplicationSchema.index({ jobId: 1, candidateEmail: 1 }, { unique: true });
ApplicationSchema.index({ companyId: 1, appliedAt: -1 });

module.exports = mongoose.model('Application', ApplicationSchema);
