/**
 * preprocess.js — Text Preprocessing Pipeline
 *
 * Pipeline:
 * 1. Lowercase
 * 2. Remove punctuation / special chars
 * 3. Tokenize
 * 4. Filter stopwords & token pendek
 * 5. Stemming (Porter)
 * 6. Synonym Expansion → token "js" menghasilkan ["js", "javascript"]
 *    Ini yang paling berpengaruh pada skor similarity!
 */

const natural = require('natural');

const stemmer   = natural.PorterStemmer;
const tokenizer = new natural.WordTokenizer();

// ─── Stopwords (ID + EN) ──────────────────────────────────────
const stopwords = new Set([
  // English
  'a','an','the','and','or','but','is','are','was','were','in','on','at','to',
  'for','of','with','by','as','it','this','that','which','who','whom','be',
  'been','being','have','has','had','do','does','did','will','would','shall',
  'should','can','could','may','might','must','i','you','he','she','we','they',
  'job','work','required','requirement','responsibility','skills','plus',
  'experience','year','years','position','company','candidate','team','role',
  // Indonesian
  'dan','atau','tapi','adalah','ialah','di','ke','dari','pada','untuk','bagi',
  'karena','oleh','dengan','yang','ini','itu','tersebut','saya','anda','kita',
  'mereka','akan','bisa','dapat','harus','telah','sedang','jika','bila',
  'sebagai','pengalaman','tahun','pekerjaan','lamaran','dibutuhkan','syarat',
  'tanggung','jawab','keahlian','nilai','tambah','kami','juga','lebih','sangat',
  'dalam','tidak','ada','namun','serta','jika','agar','supaya','maka','nya',
]);

// ─── Synonym Map (canonical term ← aliases) ──────────────────
// Kunci = canonical term (yang masuk ke vocabulary)
// Value = array of alias yang akan di-expand ke canonical term
//
// Cara kerja: jika token = "js" → tambahkan token "javascript" juga
// Sehingga "js" di CV akan match dengan "javascript" di job
const SYNONYM_MAP = {
  'javascript': ['js', 'nodejs', 'node', 'ecmascript', 'es6', 'react', 'reactjs', 'vue', 'vuejs', 'angular'],
  'backend':    ['server', 'api', 'serverside', 'restful', 'microservice'],
  'frontend':   ['ui', 'client', 'clientside', 'responsive'],
  'database':   ['mysql', 'postgresql', 'postgres', 'sql', 'mongodb', 'mongo', 'rdbms', 'nosql'],
  'security':   ['cybersecurity', 'penetration', 'pentest', 'infosec', 'networksecurity'],
  
  // Other helpful expansions
  'python':     ['py', 'django', 'flask', 'fastapi'],
  'java':       ['spring', 'springboot'],
  'php':        ['laravel', 'codeigniter'],
  'mobile':     ['flutter', 'dart', 'kotlin', 'swift', 'android', 'ios'],
  'devops':     ['docker', 'kubernetes', 'k8s', 'aws', 'gcp', 'cicd', 'jenkins', 'linux'],
  'agile':      ['scrum', 'kanban']
};

// Bangun reverse lookup: alias → canonical term
const ALIAS_TO_CANONICAL = {};
for (const [canonical, aliases] of Object.entries(SYNONYM_MAP)) {
  for (const alias of aliases) {
    const key = alias.toLowerCase().replace(/[\s\-\.\/]+/g, '');
    ALIAS_TO_CANONICAL[key] = canonical;
    ALIAS_TO_CANONICAL[alias.toLowerCase()] = canonical;
  }
}

/**
 * Expand token ke dirinya sendiri + canonical synonym jika ditemukan alias
 * Contoh: "js" → ["js", "javascript"]
 *
 * @param {string} token
 * @returns {string[]}
 */
const expandSynonyms = (token) => {
  const result = [token];
  const canonical = ALIAS_TO_CANONICAL[token];
  if (canonical && canonical !== token) {
    result.push(canonical);
  }
  return result;
};

/**
 * Preprocess text: Lowercase → Remove Punctuation → Tokenize →
 *                  Filter Stopwords → Stem → Synonym Expansion
 *
 * @param {string} text
 * @returns {string[]} Array of processed tokens (includes synonym expansions)
 */
const preprocessText = (text) => {
  if (!text || typeof text !== 'string') return [];

  // 1. Lowercase
  let processed = text.toLowerCase();

  // 2. Hapus karakter khusus, pertahankan huruf & angka & spasi
  processed = processed.replace(/[^a-z0-9\s]/g, ' ');

  // 3. Tokenize
  const rawTokens = tokenizer.tokenize(processed) || [];

  // 4. Filter stopwords + token terlalu pendek (< 3 karakter)
  const filtered = rawTokens.filter(
    token => token.length >= 3 && !stopwords.has(token)
  );

  // 5. Stemming + 6. Synonym Expansion per token
  const finalTokens = [];
  for (const token of filtered) {
    const stemmed = stemmer.stem(token);

    // Expand synonym DARI token asli (sebelum stemming — lebih mudah di-lookup)
    const expanded      = expandSynonyms(token);
    const expandedStem  = expandSynonyms(stemmed);

    // Kumpulkan semua varian unik
    const uniqueExpansions = new Set([
      stemmed,
      ...expanded,
      ...expandedStem,
    ]);

    finalTokens.push(...uniqueExpansions);
  }

  return finalTokens;
};

module.exports = preprocessText;
module.exports.expandSynonyms = expandSynonyms;
module.exports.ALIAS_TO_CANONICAL = ALIAS_TO_CANONICAL;
