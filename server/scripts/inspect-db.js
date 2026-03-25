const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vocabulary = require('../models/Vocabulary');
const Job = require('../models/Job');

dotenv.config({ path: '../.env' });

const inspectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const vocab = await Vocabulary.findOne().sort({ createdAt: -1 });
    if (!vocab) {
        console.log('❌ Vocabulary is EMPTY. System is not trained.');
    } else {
        console.log('✅ Vocabulary found.');
        console.log('Terms count:', vocab.terms.length);
        console.log('IDF type:', typeof vocab.idf);
        console.log('IDF is Map?', vocab.idf instanceof Map);
        console.log('IDF Keys sample:', Object.keys(vocab.idf instanceof Map ? Object.fromEntries(vocab.idf) : vocab.idf).slice(0, 5));
    }

    const jobCount = await Job.countDocuments();
    console.log(`Job count: ${jobCount}`);
    
    if (jobCount > 0) {
        const job = await Job.findOne();
        console.log('Sample Job Vector keys:', Object.keys(job.tfidfVector instanceof Map ? Object.fromEntries(job.tfidfVector) : job.tfidfVector).slice(0, 5));
    }

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

inspectDB();
