const mongoose = require('mongoose');

const DEFAULT_DURATION_DAYS = 30;

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const startOfToday = (date = new Date()) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

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
  // URL sumber loker (untuk deduplication)
  url: {
    type: String,
    sparse: true,   // allows multiple null/undefined values while still uniquely indexing non-null URLs
    unique: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  durationDays: {
    type: Number,
    default: DEFAULT_DURATION_DAYS,
    min: 1,
  },
  expiredAt: {
    type: Date,
    default: function () {
      return addDays(this.postedAt || this.createdAt || new Date(), this.durationDays || DEFAULT_DURATION_DAYS);
    },
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'inactive'],
    default: 'active',
    index: true,
  },
  createdByType: {
    type: String,
    enum: ['scraper', 'company'],
    default: function () {
      return this.url ? 'scraper' : 'company';
    },
  },
  // Store preprocessed tokens to avoid re-processing
  processedText: {
    type: [String],
    select: false, // Don't return by default
  },
  // Store the TF-IDF vector for this job
  tfidfVector: {
    type: mongoose.Schema.Types.Mixed,
    default: [],
    select: false, // Don't return by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

JobSchema.pre('validate', function (next) {
  if (!this.postedAt) {
    this.postedAt = this.createdAt || new Date();
  }

  if (!this.durationDays || this.durationDays < 1) {
    this.durationDays = DEFAULT_DURATION_DAYS;
  }

  if (!this.expiredAt || this.isModified('postedAt') || this.isModified('durationDays')) {
    this.expiredAt = addDays(this.postedAt, this.durationDays);
  }

  if (!this.createdByType) {
    this.createdByType = this.url ? 'scraper' : 'company';
  }

  if (!this.status) {
    this.status = 'active';
  }

  if (this.status !== 'inactive' && this.expiredAt < startOfToday()) {
    this.status = 'expired';
  }

  this.updatedAt = new Date();
  next();
});

JobSchema.statics.activeFilter = function (referenceDate = new Date()) {
  return {
    status: 'active',
    expiredAt: { $gte: startOfToday(referenceDate) },
  };
};

JobSchema.statics.expireOldJobs = function (referenceDate = new Date()) {
  return this.updateMany(
    {
      status: 'active',
      expiredAt: { $lt: startOfToday(referenceDate) },
    },
    {
      $set: {
        status: 'expired',
        updatedAt: new Date(),
      },
    }
  );
};

// Index for faster searching
JobSchema.index({ title: 'text', description: 'text', skills: 'text' });
JobSchema.index({ status: 1, expiredAt: 1 });
JobSchema.index({ createdByType: 1 });

module.exports = mongoose.model('Job', JobSchema);

