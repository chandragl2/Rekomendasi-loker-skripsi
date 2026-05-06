/**
 * glintsScraper.js — Core Puppeteer-based Glints scraper
 *
 * Exports:  scrapeGlints(maxJobs)
 * Returns:  Array of job objects { title, company, location, type, category, skills, qualifications, description, url, source }
 *
 * Strategy:
 *   1. Open the Glints job listing page with randomised user-agents & headers.
 *   2. Auto-scroll to trigger lazy-load and collect job card links.
 *   3. Visit each job detail page and extract structured data.
 *   4. Return deduplicated, clean results.
 */

'use strict';

const puppeteer = require('puppeteer');
const { CATEGORY_KEYWORDS } = require('../utils/category');

// ─── Constants ────────────────────────────────────────────────────────────────

const GLINTS_BASE = 'https://glints.com';
const LISTING_URL = 'https://glints.com/id/lowongan-kerja';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomAgent = () => USER_AGENTS[randomInt(0, USER_AGENTS.length - 1)];

/**
 * Detect category from a combined text blob using CATEGORY_KEYWORDS
 */
const detectCategoryFromText = (text = '') => {
  const lower = text.toLowerCase();
  const scores = {};
  Object.keys(CATEGORY_KEYWORDS).forEach((cat) => (scores[cat] = 0));

  Object.entries(CATEGORY_KEYWORDS).forEach(([cat, keywords]) => {
    keywords.forEach((kw) => {
      if (lower.includes(kw)) scores[cat] += 1;
    });
  });

  let maxScore = -1;
  let topCategory = 'Lainnya';
  Object.entries(scores).forEach(([cat, score]) => {
    if (score > maxScore && score > 0) {
      maxScore = score;
      topCategory = cat;
    }
  });
  return topCategory;
};

/**
 * Launch Puppeteer with stealth-like settings
 */
const launchBrowser = async () => {
  return puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1366,768',
    ],
  });
};

/**
 * Configure a new page with anti-detection headers
 */
const configurePage = async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(randomAgent());
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    Referer: 'https://google.com/',
    'Upgrade-Insecure-Requests': '1',
  });
  // Block images/fonts to speed up page loads
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const type = req.resourceType();
    if (['image', 'font', 'media'].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });
  return page;
};

/**
 * Auto-scroll the page to trigger lazy-loaded content
 */
const autoScroll = async (page, maxScrolls = 8) => {
  await page.evaluate(async (maxScrolls) => {
    await new Promise((resolve) => {
      let scrolls = 0;
      const distance = 600;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        scrolls++;
        if (
          scrolls >= maxScrolls ||
          window.scrollY + window.innerHeight >= document.body.scrollHeight - 100
        ) {
          clearInterval(timer);
          resolve();
        }
      }, 400);
    });
  }, maxScrolls);
};

/**
 * Collect job URLs from the listing page
 */
const collectJobLinks = async (page, maxJobs) => {
  await page.goto(LISTING_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await delay(randomInt(2500, 4000));

  // Scroll multiple passes to load more jobs
  for (let i = 0; i < 3; i++) {
    await autoScroll(page, 10);
    await delay(randomInt(800, 1500));
  }

  const links = await page.evaluate(() => {
    const seen = new Set();
    const results = [];
    const anchors = document.querySelectorAll(
      'a[href*="/opportunities/jobs/"], a[href*="/id/opportunities/jobs/"]'
    );
    anchors.forEach((a) => {
      const href = a.getAttribute('href');
      if (!href) return;
      const clean = href.split('?')[0];
      if (!seen.has(clean)) {
        seen.add(clean);
        results.push(clean);
      }
    });
    return results;
  });

  // Normalise to full URLs
  return links
    .map((href) => (href.startsWith('http') ? href : `${GLINTS_BASE}${href}`))
    .slice(0, maxJobs);
};

/**
 * Scrape detail page of a single job
 */
const scrapeJobDetail = async (page, url) => {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await delay(randomInt(1000, 2000));

    const data = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.innerText.trim() : '';
      };

      const getList = (selector) => {
        return Array.from(document.querySelectorAll(selector))
          .map((el) => el.innerText.trim())
          .filter(Boolean);
      };

      // Title
      const title =
        getText('h1') ||
        getText('[data-cy="job-detail-title"]') ||
        getText('[class*="JobTitle"]') ||
        '';

      // Company
      const company =
        getText('[data-cy="company-name"]') ||
        getText('[class*="CompanyName"]') ||
        getText('a[href*="/companies/"]') ||
        '';

      // Location
      const location =
        getText('[data-cy="job-detail-location"]') ||
        getText('[class*="LocationText"]') ||
        getText('[class*="location"]') ||
        'Indonesia';

      // Employment type
      const type =
        getText('[data-cy="job-detail-employment-type"]') ||
        getText('[class*="EmploymentType"]') ||
        'Penuh Waktu';

      // Description block — collect all paragraphs / li items inside job detail
      const descEl =
        document.querySelector('[data-cy="job-detail-description"]') ||
        document.querySelector('[class*="JobDescription"]') ||
        document.querySelector('article') ||
        document.querySelector('main');

      const description = descEl ? descEl.innerText.trim() : document.body.innerText.trim();

      // Skills tags (Glints renders skill chips)
      const skills = getList(
        '[data-cy="job-detail-skill"] span, [class*="SkillTag"], [class*="skill-tag"]'
      );

      // Qualifications — bullet list items inside desc
      const qualifications = getList(
        '[data-cy="job-detail-description"] li, [class*="JobDescription"] li'
      );

      return { title, company, location, type, description, skills, qualifications };
    });

    if (!data.title || !data.company) return null;

    const category = detectCategoryFromText(
      `${data.title} ${data.description} ${data.skills.join(' ')}`
    );

    return {
      title: data.title,
      company: data.company,
      location: data.location || 'Indonesia',
      type: data.type || 'Penuh Waktu',
      category,
      skills: data.skills,
      qualifications: data.qualifications,
      description: data.description.slice(0, 3000), // cap length
      url,
      source: 'Glints',
    };
  } catch (err) {
    return null; // silently skip failed detail pages
  }
};

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Scrape jobs from Glints
 * @param {number} maxJobs  - Maximum number of jobs to scrape (default 30)
 * @returns {Promise<Array>} - Array of job objects
 */
const scrapeGlints = async (maxJobs = 30) => {
  let browser = null;

  try {
    browser = await launchBrowser();
    const listingPage = await configurePage(browser);

    // Step 1: Collect job links from listing
    const jobLinks = await collectJobLinks(listingPage, maxJobs);
    await listingPage.close();

    if (jobLinks.length === 0) {
      return { jobs: [], botDetected: true };
    }

    // Step 2: Scrape each job detail with inter-request delays
    const jobs = [];
    const detailPage = await configurePage(browser);

    for (let i = 0; i < jobLinks.length; i++) {
      const job = await scrapeJobDetail(detailPage, jobLinks[i]);
      if (job) jobs.push(job);
      // Polite delay between detail page visits
      if (i < jobLinks.length - 1) {
        await delay(randomInt(1200, 2500));
      }
    }

    await detailPage.close();
    return { jobs, botDetected: jobs.length === 0 && jobLinks.length > 0 };
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (_) { /* ignore */ }
    }
  }
};

module.exports = { scrapeGlints };
