/**
 * preprocess.js — Text Preprocessing Pipeline
 *
 * Pipeline:
 * 1. Case folding (lowercase)
 * 2. Remove punctuation / special chars (retain exceptions like c++, c#)
 * 3. Tokenize
 * 4. Stopword removal (EN + ID + custom noise/soft-skills)
 * 5. Stemming (Porter)
 * 6. Synonym expansion (js → javascript)
 */

const natural = require('natural');

const stemmer   = natural.PorterStemmer;
const tokenizer = new natural.WordTokenizer();

// ─── 1. STOPWORDS (EN + ID + Soft-Skill Custom) ───────────────────────────
const STOPWORDS = new Set([
  // === English General ===
  'a','an','the','and','or','but','is','are','was','were','in','on','at','to',
  'for','of','with','by','as','it','this','that','which','who','whom','be',
  'been','being','have','has','had','do','does','did','will','would','shall',
  'should','can','could','may','might','must','i','you','he','she','we','they',
  // === English Job Generic ===
  'job','work','required','requirement','responsibility','skills','plus',
  'experience','year','years','position','company','candidate','team','role',
  'ability','able','knowledge','good','strong','excellent','great','high',
  'well','also','using','use','include','including','based','new','will',
  'manage','support','ensure','provide','develop','create','maintain','build',
  'implement','responsible','must','minimum','least','preferred','advantage',
  'familiar','understanding','working','within','across','related','full',
  'part','time','apply','application','need','needs','looking','hire','open',
  // === Indonesian General ===
  'dan','atau','tapi','adalah','ialah','di','ke','dari','pada','untuk','bagi',
  'karena','oleh','dengan','yang','ini','itu','tersebut','saya','anda','kita',
  'mereka','akan','bisa','dapat','harus','telah','sedang','jika','bila',
  'sebagai','juga','lebih','sangat','dalam','tidak','ada','namun','serta',
  'agar','supaya','maka','nya','ini','itu','kami','kamu','apa','siapa',
  'kapan','dimana','bagaimana','berapa','setiap','semua','beberapa','lain',
  'lagi','sudah','belum','pernah','selalu','sering','jarang','hampir',
  // === Indonesian Job Generic ===
  'pengalaman','tahun','pekerjaan','lamaran','dibutuhkan','syarat','tanggung',
  'jawab','keahlian','nilai','tambah','magang','intern','perusahaan','posisi',
  'kandidat','melamar','lowongan','kerja','penempatan','gaji','benefit',
  // === Soft-Skill Custom Stopwords (KUNCI UTAMA PERBAIKAN) ===
  'komunikasi','communication','teamwork','kerjasama','tim','pelayanan',
  'service','customer','pelanggan','nasabah','klien','client',
  'kepemimpinan','leadership','interpersonal','adaptasi','adaptable',
  'kreatif','creative','creativity','inovatif','innovative','innovation',
  'motivasi','motivation','disiplin','discipline','jujur','honest',
  'teliti','detail','cermat','rajin','proaktif','proactive','inisiatif',
  'initiative','mandiri','independen','independent','antusias','enthusiastic',
  'bertanggung','integritas','integrity','profesional','professional',
  'komitmen','commitment','dedikasi','dedication','loyalitas','loyalty',
  'presentasi','presentation','negosiasi','negotiation','persuasi',
  'empati','empathy','sosial','social','melayani','melayanan','retailing',
]);

// ─── 2. SYNONYM MAP (canonical ← aliases) ─────────────────────────────────
const SYNONYM_MAP = {
  // IT
  'javascript': ['js', 'ecmascript', 'es6', 'es7', 'es8', 'es2015', 'es2016'],
  'typescript': ['ts'],
  'nodejs':     ['node'],
  'reactjs':    ['react'],
  'vuejs':      ['vue'],
  'angularjs':  ['angular'],
  'nextjs':     ['next'],
  'expressjs':  ['express'],
  'nestjs':     ['nest'],
  'postgresql': ['postgres', 'psql'],
  'mongodb':    ['mongo'],
  'python':     ['py'],
  'kubernetes': ['k8s'],
  'cicd':       ['ci', 'cd'],
  'machinelearning': ['ml'],
  'deeplearning':    ['dl'],
  'computervision':  ['cv'],
  'fullstack':  ['fullstackdeveloper'],
  'frontend':   ['frontenddev', 'frontendweb'],
  'backend':    ['backenddev', 'backendweb'],
  'sklearn':    ['scikitlearn', 'scikit'],
  'springboot': ['spring'],
  'reactnative': ['rn'],
  // Finance & Admin (biar align)
  'keuangan':   ['finance', 'financial'],
  'akuntansi':   ['accounting', 'accountant'],
  'administrasi': ['admin', 'administration'],
  'operasional':  ['operation', 'operations'],
};

// Reverse lookup: alias → canonical
const ALIAS_TO_CANONICAL = {};
for (const [canonical, aliases] of Object.entries(SYNONYM_MAP)) {
  for (const alias of aliases) {
    ALIAS_TO_CANONICAL[alias.toLowerCase().replace(/[\s\-\.\/]+/g, '')] = canonical;
    ALIAS_TO_CANONICAL[alias.toLowerCase()] = canonical;
  }
}

/**
 * Expand token ke dirinya sendiri + canonical synonym jika ditemukan alias
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
 * Preprocess text: Case folding → Bersihkan simbol → Tokenize →
 *   Stopword removal → Stemming → Synonym Expansion
 *
 * (WHITELIST DIHAPUS agar support multi-domain: IT, Finance, Admin, dll)
 *
 * @param {string} text
 * @param {Object} options
 * @param {boolean} options.debug  - Jika true, tampilkan info preprocessing ke console
 * @returns {string[]} Array of processed tokens
 */
const preprocessText = (text, options = {}) => {
  if (!text || typeof text !== 'string') return [];
  const { debug = false } = options;

  let processed = text.toLowerCase();

  // Pertahankan C++ dan C# dll, hapus sisa simbol
  processed = processed
    .replace(/c\+\+/g, 'cplusplus')
    .replace(/c#/g, 'csharp')
    .replace(/\.net/g, 'dotnet')
    .replace(/[^a-z0-9\s]/g, ' ');

  const rawTokens = tokenizer.tokenize(processed) || [];

  // Filter stopwords + token pendek
  const afterStopwords = rawTokens.filter(
    token => token.length >= 2 && !STOPWORDS.has(token)
  );

  if (debug) {
    console.log(`[PREPROCESS] Raw tokens: ${rawTokens.length} | After stopwords: ${afterStopwords.length}`);
  }

  // Stemming + Synonym Expansion
  const finalTokens = [];
  for (const token of afterStopwords) {
    const stemmed = stemmer.stem(token);

    const expanded     = expandSynonyms(token);
    const expandedStem = expandSynonyms(stemmed);

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
module.exports.expandSynonyms     = expandSynonyms;
module.exports.ALIAS_TO_CANONICAL = ALIAS_TO_CANONICAL;
module.exports.STOPWORDS          = STOPWORDS;
