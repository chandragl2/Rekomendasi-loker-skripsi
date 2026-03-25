const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Vocabulary = require('../models/Vocabulary');
const Job = require('../models/Job');
const preprocessText = require('../utils/preprocess');
const { createVector } = require('../utils/tfidf');
const calculateCosineSimilarity = require('../utils/cosineSimilarity');

dotenv.config({ path: path.join(__dirname, '../.env') });

const runLogicDebug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // MOCK INPUT (Instead of PDF)
        const cvText = "Frontend Developer React JavaScript";
        console.log('Mock CV Text:', cvText);

        // 2. Preprocess CV
        const cvTokens = preprocessText(cvText);
        console.log('CV Tokens:', cvTokens);

        // 3. Load Vocabulary & IDF
        console.log('Loading Vocabulary...');
        const vocab = await Vocabulary.getVocabulary();
        if (!vocab) {
            throw new Error('Vocabulary not found in DB');
        }
        console.log('Vocabulary loaded. Terms count:', vocab.terms.length);
        
        // Debug IDF structure
        console.log('IDF Type in DB:', typeof vocab.idf);
        console.log('IDF is Map in DB?', vocab.idf instanceof Map);

        // 4. Vectorize CV using GLOBAL IDF
        // The fix I applied in controller:
        const idf = vocab.idf instanceof Map ? Object.fromEntries(vocab.idf) : vocab.idf;
        
        console.log('Vectorizing CV...');
        try {
            const cvVector = createVector(cvTokens, idf);
            console.log('CV Vector created. Terms:', Object.keys(cvVector).length);
            console.log('Sample Vector:', JSON.stringify(cvVector));
        } catch (vecErr) {
            console.error('Vectorization Failed:', vecErr);
            throw vecErr;
        }

        // 5. Fetch All Jobs
        const jobs = await Job.find({}).select('+tfidfVector');
        console.log(`Comparing against ${jobs.length} jobs...`);

        // 6. Calculate Similarity
        // Re-fetch vocab to get proper idf for vector creation if needed, but we have it.
        // Wait, ensure createVector signature: (tokens, idfModel) where idfModel is {term: score}
        
        // Check Job Vector structure
        if (jobs.length > 0) {
            const j = jobs[0];
            console.log('Job Vector Type:', typeof j.tfidfVector);
            console.log('Job Vector is Map?', j.tfidfVector instanceof Map);
            
            // Map Mongoose Map to Object if needed for calc
            // calculateCosineSimilarity expects maps or objects? 
            // Let's check calculateCosineSimilarity implementation if I can.
            // But let's assume it handles standard JS Objects (which createVector returns).
            // Mongoose Map needs .get() or conversion.
        }

        // ... skipping full recommendation loop as we just want to see if it crashes ...
        console.log('Logic check passed!');

    } catch (err) {
        console.error('LOGIC ERROR:', err);
    } finally {
        await mongoose.disconnect();
    }
};

runLogicDebug();
