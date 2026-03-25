const preprocessText = require('./utils/preprocess');
const { createVector, buildVocabulary } = require('./utils/tfidf');
const calculateCosineSimilarity = require('./utils/cosineSimilarity');
const seedJobs = require('./data/seedJobs');

// Simulasi CV Cybersecurity
const mockCV = `
I am a Security Engineer with experience in penetration testing, 
network security, and cybersecurity operations. I use tools like 
Metasploit, Nmap, and Wireshark. I understand Owasp Top 10.
`;

const runTest = () => {
    console.log("--- SIMULASI REKOMENDASI ---");
    
    // 1. Siapkan korpus jobs (seperti di database)
    const allDocsTokens = seedJobs.map(job => {
        const skillsBoost = Array(5).fill(job.skills.join(' ')).join(' ');
        const titleBoost  = Array(3).fill(job.title).join(' ');
        const textToProcess = `${titleBoost} ${skillsBoost} ${job.description}`;
        return preprocessText(textToProcess);
    });

    // 2. Bangun Vocabulary & IDF
    const { idf } = buildVocabulary(allDocsTokens);
    
    // 3. Vektorisasi semua Jobs
    const jobVectors = allDocsTokens.map(tokens => createVector(tokens, idf));

    // 4. Proses CV
    const cvTokens = preprocessText(mockCV);
    const cvVector = createVector(cvTokens, idf);

    console.log(`CV Tokens: ${cvTokens.length}`);
    console.log(`CV Terms found in Vocab: ${Object.keys(cvVector).length}`);

    // 5. Hitung Kemiripan
    const results = seedJobs.map((job, i) => {
        const score = calculateCosineSimilarity(cvVector, jobVectors[i]);
        return { 
            title: job.title, 
            score: (score * 100).toFixed(2) + '%',
            rawScore: score 
        };
    });

    // 6. Tampilkan Top 10
    results.sort((a,b) => b.rawScore - a.rawScore);
    console.log("\nTop 10 Rekomendasi untuk CV Cybersecurity:");
    results.slice(0, 10).forEach((r, i) => {
        console.log(`${i+1}. ${r.title.padEnd(30)} | Score: ${r.score}`);
    });
};

runTest();
