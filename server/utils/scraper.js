/**
 * scraper.js — Glints Real-Time Scraper (Improved)
 *
 * Alur:
 * 1. Buka halaman listing Glints
 * 2. Ambil daftar job card (title, company, location, type, skills, jobUrl)
 * 3. Untuk setiap job → buka halaman DETAIL → ambil deskripsi ASLI
 * 4. Bersihkan via cleanJob() sebelum return
 */

const puppeteer = require('puppeteer');
const { cleanJob } = require('./cleaner');

// ─── Konstanta ───────────────────────────────────────────────
const BASE_URL    = 'https://glints.com';
const DELAY_BETWEEN_PAGES = 1500; // ms antar page detail
const DETAIL_TIMEOUT      = 20000; // ms timeout untuk halaman detail

// ─── User-agent pool ──────────────────────────────────────────
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
];

const randomUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const pLimit = (concurrency) => {
  const queue = [];
  let activeCount = 0;
  const next = () => {
    activeCount--;
    if (queue.length > 0) queue.shift()();
  };
  return (fn) => new Promise((resolve, reject) => {
    const run = () => {
      activeCount++;
      fn().then(resolve).catch(reject).finally(next);
    };
    if (activeCount < concurrency) run();
    else queue.push(run);
  });
};

// ─── Kategorisasi otomatis dari judul ────────────────────────
const categorizeJob = (title = '') => {
  const t = title.toLowerCase();
  if (/engineer|developer|programmer|software|backend|frontend|fullstack|devops|mobile|cloud|cyber|network|system admin|it support/.test(t)) return 'Engineering';
  if (/data scientist|data engineer|data analyst|machine learning|ai |nlp|deep learning|big data/.test(t)) return 'Data';
  if (/product manager|product owner|scrum master|agile/.test(t)) return 'Product';
  if (/ui designer|ux designer|graphic design|visual design|illustrat|motion design/.test(t)) return 'Design';
  if (/marketing|brand|seo|sem|content|social media|digital marketing|growth|ads/.test(t)) return 'Marketing';
  if (/finance|accounting|tax|audit|treasury|credit|risk|banking|akuntan/.test(t)) return 'Finance';
  if (/health|medical|clinical|nurse|doctor|pharma|apoteker/.test(t)) return 'Healthcare';
  if (/teacher|trainer|tutor|instructor|curriculum|edukasi|education/.test(t)) return 'Education';
  if (/lawyer|legal|counsel|compliance|hukum/.test(t)) return 'Legal';
  if (/sales|account executive|business development|bd manager/.test(t)) return 'Sales';
  if (/hr |human resource|recruiter|talent acquisition|people ops/.test(t)) return 'HR';
  if (/operation|logistic|supply chain|warehouse|procurement|purchasing/.test(t)) return 'Operations';
  if (/video|podcast|copywriter|3d|motion|illustrator|photography|videograph|creative/.test(t)) return 'Creative';
  return 'Lainnya';
};

// ─── Buka browser sekali, reuse untuk semua page ─────────────
const launchBrowser = async () => {
  return puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--disable-gpu',
      '--window-size=1366,768'
    ]
  });
};

// ─── Setup page dengan UA dan headers ────────────────────────
const setupPage = async (browser) => {
  const page = await browser.newPage();
  await page.setUserAgent(randomUA());
  await page.setViewport({ width: 1366, height: 768 });
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Referer': 'https://glints.com/',
  });
  // Block gambar & font untuk mempercepat
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const type = req.resourceType();
    if (['image', 'font', 'media', 'stylesheet'].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });
  return page;
};

// ────────────────────────────────────────────────────────────
// STEP 1: Scrape listing page → ambil job cards + URLs
// ────────────────────────────────────────────────────────────
const scrapeListingPage = async (browser, maxJobs) => {
  const page = await setupPage(browser);
  // Lakukan rotasi pencarian berdasar list keyword untuk menembus deduplikasi database
  const keywords = ['programmer', 'data', 'marketing', 'design', 'sales', 'manager', 'admin', 'teknik', 'digital', 'developer', 'finance', 'akuntansi', 'guru', 'HR', 'startup', 'startup', 'software', 'writer'];
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  const LISTING_URL = `https://glints.com/id/opportunities/jobs/explore?keyword=${randomKeyword}&country=ID`;
  
  console.log(`[SCRAPER] Opening listing: ${LISTING_URL}`);

  try {
    await page.goto(LISTING_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await sleep(3000);

    // Tunggu job card muncul
    try {
      await page.waitForSelector('[class*="JobCard"], article[class*="job"], [data-cy*="job"]', { timeout: 15000 });
    } catch (_) {
      console.log('[SCRAPER] Timeout waiting for job cards, proceeding anyway...');
    }

    // Scroll pelan untuk trigger lazy loading (loop 7x)
    for (let i = 0; i < 7; i++) {
      console.log(`[SCRAPER] Scrolling ${i+1}/7 to trigger lazy loading...`);
      await autoScroll(page);
      await sleep(1500);
    }

    // DEBUG JUMLAH CARD (WAJIB)
    try {
      const jobCards = await page.$$('[class*="JobCard"], [data-cy*="job"], a[href*="/opportunities/jobs/"]');
      console.log("[SCRAPER] Debug: Estimasi elemen job yang terdeteksi sebelum ekstrak:", jobCards.length);
    } catch(err) {
      console.log("[SCRAPER] Error debugging card count", err.message);
    }

    // Ekstrak daftar job dari listing
    const rawJobs = await page.evaluate((base) => {
      const metaKeywords = [
        'perusahaan', 'premium', 'kontrak', 'full time', 'part time', 'penuh waktu',
        'paruh waktu', 'hybrid', 'remote', 'magang', 'freelance', 'sarjana', 'diploma',
        'sma', 'smk', 'minimal', 'tahun', 'bulan', 'juta', 'ribu', 'gaji', 'salary',
        '1-3', '3-5', '0-1', '5+', 's1', 's2', 'd3', 'd4', 'fresh graduate',
        'urgent', 'experience', 'berpengalaman', 'not disclosed'
      ];

      const isRealSkill = (tag) => {
        if (!tag || typeof tag !== 'string') return false;
        const lower = tag.toLowerCase().trim();
        if (lower.length < 2 || lower.length > 60) return false;
        if (/^\d+$/.test(lower)) return false;
        return !metaKeywords.some(kw => lower.includes(kw));
      };

      // Coba dapatkan dari link secara definitif
      const links = document.querySelectorAll('a[href*="/opportunities/jobs/"], a[href*="/jobs/"]');
      const uniqueJobMap = new Map();
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const cleanHref = href.split('?')[0];
        if (!uniqueJobMap.has(cleanHref)) {
          // Cari container parent yang berisi info card (minimal 50 karakter textnya)
          let el = link;
          while (el && el.parentElement && el.innerText.length < 50 && el.tagName !== 'BODY') {
             el = el.parentElement;
          }
          uniqueJobMap.set(cleanHref, { link, el });
        }
      });

      const items = Array.from(uniqueJobMap.values());

      return items.map(({ link, el }) => {
        const rawLines = (el.innerText || '').split('\n').map(l => l.trim()).filter(Boolean);
        if (rawLines.length < 2) return null;

        // Title
        let titleText = '';
        for (const sel of ['h3', 'h2', '[class*="JobTitle"]', '[class*="title"]']) {
          const titleEl = el.querySelector(sel);
          if (titleEl?.innerText?.trim()) { titleText = titleEl.innerText.trim(); break; }
        }
        if (!titleText) titleText = rawLines[0] || 'Posisi Tersedia';

        // Job URL
        let jobUrl = link.getAttribute('href');
        jobUrl = jobUrl.startsWith('http') ? jobUrl : `${base}${jobUrl}`;

        // Company
        let companyText = 'Unknown Company';
        for (const sel of ['a[href*="/companies/"]', '[class*="CompanyName"]', '[class*="company"]']) {
          const compEl = el.querySelector(sel);
          if (compEl?.innerText?.trim() && compEl.innerText.trim() !== titleText) {
            companyText = compEl.innerText.trim().split('\n')[0];
            break;
          }
        }
        if (companyText === 'Unknown Company') {
          // fallback cari baris kedua/ketiga yang bukan title
          companyText = rawLines.find(l => l !== titleText && !l.includes('Rp') && !l.includes('Bulan')) || 'Unknown Company';
        }

        // Location
        let locationText = 'Indonesia';
        for (const sel of ['[class*="JobLocation"]', '[class*="Location"]', '[class*="location"]', '[class*="city"]']) {
          const locEl = el.querySelector(sel);
          if (locEl?.innerText?.trim()) { locationText = locEl.innerText.trim().split('\n')[0]; break; }
        }
        if (locationText === 'Indonesia') {
           locationText = rawLines.find(l => l.includes(',') || l.toLowerCase().includes('jakarta') || l.toLowerCase().includes('kota')) || 'Indonesia';
        }

        // Type
        let jobType = 'Penuh Waktu';
        for (const sel of ['[class*="JobType"]', '[class*="EmploymentType"]', '[class*="employment"]']) {
          const typeEl = el.querySelector(sel);
          if (typeEl?.innerText?.trim()) { jobType = typeEl.innerText.trim(); break; }
        }

        // Skills (from card tags)
        const tagEls = el.querySelectorAll('[class*="Tag"], [class*="tag"], [class*="Skill"], [class*="skill"], [class*="badge"]');
        let rawTags = Array.from(tagEls).map(t => t.innerText?.trim()).filter(Boolean);
        
        // kalau tag kosong, coba parse dari sisa baris
        if (rawTags.length === 0) {
           rawTags = rawLines.filter(l => l !== titleText && l !== companyText && l !== locationText && l.length <= 40);
        }

        const seenSkills = new Set();
        const skills = rawTags
          .filter(isRealSkill)
          .filter(s => {
            const key = s.toLowerCase();
            if (seenSkills.has(key)) return false;
            seenSkills.add(key);
            return true;
          })
          .slice(0, 8);

        return { title: titleText, company: companyText, location: locationText, type: jobType, skills, jobUrl };
      }).filter(Boolean);
    }, BASE_URL);

    console.log(`[SCRAPER] Found ${rawJobs.length} job cards on listing page.`);
    return rawJobs.slice(0, maxJobs);

  } finally {
    await page.close();
  }
};

// ────────────────────────────────────────────────────────────
// STEP 2: Scrape halaman DETAIL setiap job → ambil deskripsi ASLI
// ────────────────────────────────────────────────────────────
const scrapeJobDetail = async (browser, jobBasic) => {
  const page = await setupPage(browser);
  try {
    console.log(`[SCRAPER] Detail: ${jobBasic.title} → ${jobBasic.jobUrl}`);
    await page.goto(jobBasic.jobUrl, { waitUntil: 'domcontentloaded', timeout: DETAIL_TIMEOUT });
    await sleep(2000);

    const detail = await page.evaluate(() => {
      // ── Cari deskripsi dari berbagai kemungkinan selector ──
      const descSelectors = [
        '[class*="JobDescription"]',
        '[class*="job-description"]',
        '[class*="JobDetails"]',
        '[class*="description-content"]',
        '[class*="DescriptionContent"]',
        '[class*="job-detail"]',
        'div[class*="content"] p',
        'section[class*="description"]',
        '[data-cy*="description"]',
        'article p',
      ];

      let descriptionText = '';
      for (const sel of descSelectors) {
        const el = document.querySelector(sel);
        if (el?.innerText?.trim().length > 80) {
          descriptionText = el.innerText.trim();
          break;
        }
      }

      // Fallback: ambil semua <p> yang panjang di area main content
      if (!descriptionText) {
        const paragraphs = document.querySelectorAll('main p, article p, [role="main"] p');
        const longParagraphs = Array.from(paragraphs)
          .map(p => p.innerText?.trim())
          .filter(t => t && t.length > 50)
          .join('\n\n');
        if (longParagraphs.length > 80) descriptionText = longParagraphs;
      }

      // ── Cari qualifications / requirements ──
      const qualSelectors = [
        '[class*="Qualification"]', '[class*="Requirement"]',
        '[class*="qualification"]', '[class*="requirement"]',
        '[data-cy*="qualification"]',
      ];

      let qualText = '';
      for (const sel of qualSelectors) {
        const el = document.querySelector(sel);
        if (el?.innerText?.trim()) { qualText = el.innerText.trim(); break; }
      }

      // Parse qualifications sebagai bullet list dari <li> atau newlines
      const qualLines = [];
      const qualEls = document.querySelectorAll('[class*="Qualification"] li, [class*="Requirement"] li, [class*="qualification"] li');
      if (qualEls.length > 0) {
        Array.from(qualEls).forEach(li => {
          const t = li.innerText?.trim();
          if (t && t.length > 5) qualLines.push(t);
        });
      } else if (qualText) {
        qualText.split('\n')
          .map(l => l.replace(/^[\-\•\*\d\.\)]\s*/, '').trim())
          .filter(l => l.length > 5)
          .forEach(l => qualLines.push(l));
      }

      // ── Tambahan skills dari halaman detail (lebih lengkap dari card) ──
      const skillEls = document.querySelectorAll(
        '[class*="Skill"] span, [class*="skill"] span, [class*="Tag"] span, [class*="tag"] span, ' +
        '[class*="Requirement"] [class*="Tag"], [class*="SkillTag"]'
      );
      const detailSkills = Array.from(skillEls)
        .map(el => el.innerText?.trim())
        .filter(s => s && s.length >= 2 && s.length <= 60);

      return {
        description: descriptionText,
        qualifications: qualLines.slice(0, 8),
        detailSkills
      };
    });

    return detail;

  } catch (err) {
    console.log(`[SCRAPER] Detail page failed for "${jobBasic.title}": ${err.message}`);
    return { description: '', qualifications: [], detailSkills: [] };
  } finally {
    await page.close();
  }
};

// ────────────────────────────────────────────────────────────
// MAIN: scrapeGlints
// ────────────────────────────────────────────────────────────
/**
 * Scrape job listings dari Glints.com secara realtime.
 * Setiap job: ambil data card + buka halaman detail untuk deskripsi asli.
 *
 * @param {number} maxJobs - Max job yang diproses (default: 40)
 * @returns {Promise<Array>} Array of clean job objects
 */
const scrapeGlints = async (maxJobs = 40) => {
  console.log(`[SCRAPER] === Starting Glints Realtime Scraper (max: ${maxJobs} jobs) ===`);
  let browser;

  try {
    browser = await launchBrowser();

    // STEP 1: Ambil daftar job dari listing page
    const basicJobs = await scrapeListingPage(browser, maxJobs * 2);

    if (basicJobs.length === 0) {
      console.log('[SCRAPER] No jobs found on listing page. Possible bot detection.');
      return [];
    }

    console.log(`[SCRAPER] Total raw job cards: ${basicJobs.length}`);

    // Dedup job cards berdasarkan unique title & company
    const uniqueBasicJobs = [];
    const seenCards = new Set();
    for(const job of basicJobs) {
      const key = `${job.title} - ${job.company}`.toLowerCase();
      if(!seenCards.has(key)) {
        seenCards.add(key);
        uniqueBasicJobs.push(job);
      }
    }
    console.log(`[SCRAPER] After basic dedup: ${uniqueBasicJobs.length}`);

    // Batasi maksimum job yang diambil
    const targetJobs = uniqueBasicJobs.slice(0, maxJobs);

    // STEP 2: Pisahkan scraping card dan detail
    const DETAIL_LIMIT = 20; // limit detail fetching ke 20 job pertama agar cepat
    const jobsToDetail = targetJobs.slice(0, DETAIL_LIMIT);
    const jobsWithoutDetail = targetJobs.slice(DETAIL_LIMIT);

    console.log(`[SCRAPER] Detail jobs: ${jobsToDetail.length}, Non-detail jobs: ${jobsWithoutDetail.length}`);

    const results = [];
    const limit = pLimit(3); // Parallel scraping limit

    let completedTasks = 0;
    const processJobDetailTask = async (basic, idx) => {
      // delay ringan biar lebih natural
      await sleep(1000 + idx * 500);

      const detail = await scrapeJobDetail(browser, basic);
      await sleep(DELAY_BETWEEN_PAGES);

      // Gabungkan skills
      const allSkillsRaw = [...(basic.skills || []), ...(detail.detailSkills || [])];
      const seenSkills = new Set();
      const uniqueSkills = allSkillsRaw
        .map(s => s?.trim())
        .filter(s => {
          if (!s || s.length < 2 || s.length > 60) return false;
          const key = s.toLowerCase();
          if (seenSkills.has(key)) return false;
          seenSkills.add(key);
          return true;
        })
        .slice(0, 8);

      const realDescription = detail.description?.trim() || '';

      const rawJob = {
        title:          basic.title,
        company:        basic.company,
        location:       basic.location,
        type:           basic.type,
        // Jika tidak dapat deskripsi detail, fallback ke judul + skills
        description:    realDescription.length > 30 ? realDescription : [basic.title, ...(uniqueSkills || [])].join(' '),
        qualifications: detail.qualifications || [],
        skills:         uniqueSkills,
        category:       categorizeJob(basic.title),
        source:         'Glints',
        jobUrl:         basic.jobUrl,
      };

      const cleaned = cleanJob(rawJob);
      if (cleaned && cleaned.title) {
        results.push(cleaned);
      }
      completedTasks++;
      console.log(`[SCRAPER] Progress: ${completedTasks}/${jobsToDetail.length} details fetched.`);
    };

    // Eksekusi secara parallel dengan batasan 3 tabs active
    console.log(`[SCRAPER] Fetching details concurrently using pLimit(3)...`);
    await Promise.all(
      jobsToDetail.map((job, idx) => limit(() => processJobDetailTask(job, idx)))
    );

    // Proses sisa job yang non-detail (fallback ambil text dari card)
    if (jobsWithoutDetail.length > 0) {
      console.log(`[SCRAPER] Processing ${jobsWithoutDetail.length} card-only jobs...`);
      for (const basic of jobsWithoutDetail) {
        const rawJob = {
          title:          basic.title,
          company:        basic.company,
          location:       basic.location,
          type:           basic.type,
          description:    [
            basic.title,
            ...(basic.skills || [])
          ].join(' '),
          qualifications: [],
          skills:         basic.skills || [],
          category:       categorizeJob(basic.title),
          source:         'Glints',
          jobUrl:         basic.jobUrl,
        };

        const cleaned = cleanJob(rawJob);
        if (cleaned && cleaned.title) {
          results.push(cleaned);
        }
      }
    }

    console.log(`[SCRAPER] === Done: ${results.length} valid jobs from Glints ===`);
    return results;

  } catch (err) {
    console.error('[SCRAPER] Fatal error:', err.message);
    return [];
  } finally {
    if (browser) {
      await browser.close();
      console.log('[SCRAPER] Browser closed.');
    }
  }
};

// ─── Scroll halaman secara gradual ───────────────────────────
const autoScroll = async (page) => {
  await page.evaluate(async () => {
    // Scroll a bit faster (distance 600, 300ms) to ensure it reaches bottom within reasonable time
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 800;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        // Ensure we handle infinite scroll where scrollHeight increases over time
        // Calculate max allowed time to avoid hanging forever (~8s maximum per call)
        if (totalHeight >= scrollHeight - window.innerHeight || totalHeight > 50000) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
      
      // Fallback resolve timer
      setTimeout(() => { clearInterval(timer); resolve(); }, 8000);
    });
  });
};

module.exports = scrapeGlints;
