const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from server directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const Vocabulary = require('../models/Vocabulary');
const Job = require('../models/Job');

const inspectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const vocab = await Vocabulary.findOne().sort({ createdAt: -1 });
        if (!vocab) {
            console.log('❌ Vocabulary is EMPTY. System is not trained.');
        } else {
            console.log('✅ Vocabulary found.');
            if (vocab.terms) console.log('Terms count:', vocab.terms.length);
            else console.log('❌ Vocabulary.terms IS MISSING');
            
            if (vocab.idf) {
                console.log('IDF type:', typeof vocab.idf);
                // Check if it's a Map or Object
                if (vocab.idf instanceof Map) {
                    console.log('IDF is a Map. Size:', vocab.idf.size);
                } else {
                    console.log('IDF is an Object. Keys:', Object.keys(vocab.idf).length);
                }
            } else {
                console.log('❌ Vocabulary.idf IS MISSING');
            }
        }

        const jobCount = await Job.countDocuments();
        console.log(`Job count: ${jobCount}`);
        
        if (jobCount > 0) {
            const job = await Job.findOne().select('+tfidfVector');
            if (job.tfidfVector) {
                console.log('Job has vector. Type:', typeof job.tfidfVector);
                if (job.tfidfVector instanceof Map) {
                    console.log('Vector is Map. Size:', job.tfidfVector.size);
                } else {
                    console.log('Vector is Object. Keys:', Object.keys(job.tfidfVector).length);
                }
            } else {
                console.log('❌ Job vector IS MISSING');
            }
        }

    } catch (err) {
        console.error('CRITICAL ERROR:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected'); // Force exit
        process.exit(0);
    }
};

inspectDB();
