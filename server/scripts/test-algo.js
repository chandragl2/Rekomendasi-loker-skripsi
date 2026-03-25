const preprocessText = require('../utils/preprocess');
const { buildVocabulary, createVector } = require('../utils/tfidf');
const calculateCosineSimilarity = require('../utils/cosineSimilarity');

const runTest = () => {
  console.log('--- Starting Algorithm Test ---');

  // 1. Sample Documents
  const docs = [
    "We are looking for a React Developer with Node.js experience.",
    "Data Scientist needed. Must know Python and Machine Learning.",
    "Frontend Engineer required. Knowledge of React and CSS is a must.",
    "Backend Developer with Python and Django skills."
  ];

  console.log('\n1. Preprocessing Documents...');
  const processedDocs = docs.map(doc => preprocessText(doc));
  processedDocs.forEach((doc, i) => console.log(`Doc ${i}:`, doc));

  // 2. Build Vocabulary (Global Training)
  console.log('\n2. Building Global Vocabulary...');
  // The buildVocabulary function now returns { terms, idf } but calculates IDF based on the input tokens
  // We need to adapt it slightly for the test or just use the logic directly
  const { terms, idf } = buildVocabulary(processedDocs);
  
  console.log('Vocabulary Size:', terms.length);
  console.log('Sample Terms:', terms.slice(0, 5));
  console.log('Sample IDF:', Object.entries(idf).slice(0, 5));

  // 3. Vectorize Documents
  console.log('\n3. Vectorizing Documents...');
  const docVectors = processedDocs.map(tokens => createVector(tokens, idf));
  // console.log('Doc 0 Vector:', docVectors[0]);

  // 4. Test Query (CV)
  const cvText = "I am a Frontend Developer skilled in React and JavaScript.";
  console.log('\n4. Processing CV:', cvText);
  const cvTokens = preprocessText(cvText);
  console.log('CV Tokens:', cvTokens);

  // 5. Vectorize CV using GLOBAL IDF
  const cvVector = createVector(cvTokens, idf);
  // console.log('CV Vector:', cvVector);

  // 6. Calculate Similarity
  console.log('\n5. Calculating Similarity...');
  const results = docVectors.map((docVec, i) => {
    return {
      docIndex: i,
      text: docs[i],
      score: calculateCosineSimilarity(cvVector, docVec)
    };
  });

  // Sort results
  results.sort((a, b) => b.score - a.score);

  console.log('\n--- Results ---');
  results.forEach(res => {
    console.log(`[Score: ${res.score.toFixed(4)}] ${res.text}`);
  });

  // Expected: React/Frontend jobs should be higher than Python/Data jobs
};

runTest();
