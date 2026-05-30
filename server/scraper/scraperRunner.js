/**
 * scraperRunner.js — Backend Automation Agent for Glints Job Scraper
 *
 * Responsibilities:
 *  ✅ Prevent overlapping execution via lock file
 *  ✅ Rate-limit: minimum 5 minutes between runs
 *  ✅ Retry failed scrapes (up to 2 retries)
 *  ✅ Persist results to MongoDB (dedup by URL)
 *  ✅ Structured logging with timestamps
 *  ✅ Bot-detection flagging
 *  ✅ Graceful error handling — never crashes the host process
 */

'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const { scrapeGlints } = require('./glintsScraper');

// ─── Configuration ────────────────────────────────────────────────────────────

const CONFIG = {
  /** Default max jobs per run */
  maxJobs: 30,
  /** Min interval between runs (ms) — 5 minutes */
  minIntervalMs: 5 * 60 * 1000,
  /** Max retries on failure */
  maxRetries: 2,
  /** Delay between retries (ms) */
  retryDelayMs: 15 * 1000,
  /** Lock file location */
  lockFile: path.join(__dirname, '../data/.scraper.lock'),
  /** Last-run timestamp file */
  lastRunFile: path.join(__dirname, '../data/.scraper_lastrun'),
  /** Log file */
  logFile: path.join(__dirname, '../data/scraper.log'),
};

const DEFAULT_DURATION_DAYS = 30;

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// ─── Logger ───────────────────────────────────────────────────────────────────

const log = (level, message, extra = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...extra,
  };
  const line = JSON.stringify(entry);

  // Console output
  const prefix = level === 'ERROR' ? '❌' : level === 'WARN' ? '⚠️ ' : level === 'SUCCESS' ? '✅' : 'ℹ️ ';
  console.log(`${prefix} [${entry.timestamp}] ${message}`, Object.keys(extra).length ? extra : '');

  // Append to log file
  try {
    fs.appendFileSync(CONFIG.logFile, line + '\n', 'utf8');
  } catch (_) { /* non-fatal */ }
};

// ─── Lock File Helpers ────────────────────────────────────────────────────────

const acquireLock = () => {
  if (fs.existsSync(CONFIG.lockFile)) {
    // Check if lock is stale (older than 10 minutes)
    try {
      const lockData = JSON.parse(fs.readFileSync(CONFIG.lockFile, 'utf8'));
      const age = Date.now() - new Date(lockData.startedAt).getTime();
      if (age > 10 * 60 * 1000) {
        log('WARN', 'Stale lock file detected — removing and proceeding', { staleAgeMs: age });
        fs.unlinkSync(CONFIG.lockFile);
      } else {
        return false; // Active lock — skip
      }
    } catch (_) {
      return false; // Can't read lock — be safe and skip
    }
  }

  fs.writeFileSync(
    CONFIG.lockFile,
    JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }),
    'utf8'
  );
  return true;
};

const releaseLock = () => {
  try {
    if (fs.existsSync(CONFIG.lockFile)) fs.unlinkSync(CONFIG.lockFile);
  } catch (_) { /* ignore */ }
};

// ─── Rate Limit Check ─────────────────────────────────────────────────────────

const isRateLimited = () => {
  if (!fs.existsSync(CONFIG.lastRunFile)) return false;
  try {
    const lastRun = new Date(fs.readFileSync(CONFIG.lastRunFile, 'utf8').trim()).getTime();
    const elapsed = Date.now() - lastRun;
    if (elapsed < CONFIG.minIntervalMs) {
      const waitSec = Math.ceil((CONFIG.minIntervalMs - elapsed) / 1000);
      log('WARN', `Rate limit: last run was ${Math.floor(elapsed / 1000)}s ago. Min interval: ${CONFIG.minIntervalMs / 1000}s.`, { waitSec });
      return true;
    }
  } catch (_) { /* ignore — treat as not limited */ }
  return false;
};

const recordLastRun = () => {
  try {
    fs.writeFileSync(CONFIG.lastRunFile, new Date().toISOString(), 'utf8');
  } catch (_) { /* ignore */ }
};

// ─── Data Persistence ─────────────────────────────────────────────────────────

/**
 * Save scraped jobs to MongoDB, skipping duplicates by URL.
 * Requires mongoose to already be connected.
 *
 * @param {Array} jobs
 * @returns {{ inserted: number, skipped: number }}
 */
const saveJobs = async (jobs) => {
  // Lazy-load the Job model to avoid circular issues when this module
  // is imported before Mongoose is connected
  const Job = require('../models/Job');

  let inserted = 0;
  let skipped = 0;

  for (const job of jobs) {
    try {
      const scrapedAt = new Date();
      const durationDays = Number(job.durationDays) > 0
        ? Number(job.durationDays)
        : DEFAULT_DURATION_DAYS;
      const postedAt = job.postedAt ? new Date(job.postedAt) : scrapedAt;
      const scraperLifetime = {
        postedAt,
        durationDays,
        expiredAt: job.expiredAt ? new Date(job.expiredAt) : addDays(postedAt, durationDays),
        status: 'active',
        createdByType: 'scraper',
        updatedAt: scrapedAt,
      };

      // Dedup check: same URL (most reliable) OR same title+company combo
      const existing = await Job.findOne({
        $or: [
          ...(job.url ? [{ url: job.url }] : []),
          { title: job.title, company: job.company },
        ],
      }).lean();

      if (existing) {
        const isSameUrl = job.url && existing.url === job.url;
        const isScraperJob = existing.createdByType === 'scraper' || isSameUrl;

        if (isScraperJob) {
          await Job.updateOne(
            { _id: existing._id },
            {
              $set: {
                title: job.title || existing.title,
                company: job.company || existing.company,
                location: job.location || existing.location,
                type: job.type || existing.type,
                category: job.category || existing.category,
                description: job.description || existing.description,
                qualifications: Array.isArray(job.qualifications) ? job.qualifications : existing.qualifications,
                skills: Array.isArray(job.skills) ? job.skills : existing.skills,
                source: job.source || existing.source || 'Glints',
                ...(job.url ? { url: job.url } : {}),
                ...scraperLifetime,
              },
            }
          );
        }
        skipped++;
        continue;
      }

      // Job model now has a url field — save it directly
      await Job.create({
        ...job,
        ...scraperLifetime,
      });
      inserted++;
    } catch (err) {
      log('ERROR', `Failed to save job "${job.title}"`, { error: err.message });
    }
  }

  return { inserted, skipped };
};

// ─── Core Runner ──────────────────────────────────────────────────────────────

/**
 * runScraper — Main automation entry point.
 *
 * @param {Object}  opts
 * @param {number}  [opts.maxJobs=30]   - Maximum jobs to scrape
 * @param {boolean} [opts.force=false]  - Bypass rate-limit check (use carefully)
 * @param {boolean} [opts.dbConnected]  - Whether Mongoose is already connected
 * @returns {Promise<Object>}  Run summary
 */
const runScraper = async (opts = {}) => {
  const maxJobs = opts.maxJobs ?? CONFIG.maxJobs;
  const force = opts.force ?? false;
  const dbConnected = opts.dbConnected ?? false;

  const runId = `run_${Date.now()}`;
  const startTime = new Date();
  let summary = {
    runId,
    startTime: startTime.toISOString(),
    endTime: null,
    status: 'pending',
    jobsScraped: 0,
    jobsInserted: 0,
    jobsSkipped: 0,
    retries: 0,
    botDetected: false,
    error: null,
  };

  log('INFO', `=== Scraper Run Started [${runId}] ===`, { maxJobs });

  // ── 1. Rate Limit Check ───────────────────────────────────────────────────
  if (!force && isRateLimited()) {
    summary.status = 'skipped:rate_limit';
    summary.endTime = new Date().toISOString();
    log('INFO', `Run skipped due to rate limit [${runId}]`);
    return summary;
  }

  // ── 2. Lock Acquisition ───────────────────────────────────────────────────
  if (!acquireLock()) {
    summary.status = 'skipped:locked';
    summary.endTime = new Date().toISOString();
    log('WARN', `Run skipped — another scraper instance is running [${runId}]`);
    return summary;
  }

  log('INFO', 'Lock acquired — starting scrape...');

  try {
    // ── 3. Mongoose Connection (if not already connected) ──────────────────
    let shouldDisconnect = false;
    if (!dbConnected && mongoose.connection.readyState === 0) {
      const dotenv = require('dotenv');
      dotenv.config({ path: path.join(__dirname, '../.env') });
      await mongoose.connect(process.env.MONGO_URI);
      log('INFO', 'MongoDB connected for scraper run');
      shouldDisconnect = true;
    }

    // ── 4. Scrape with Retry ───────────────────────────────────────────────
    let result = null;
    let lastError = null;

    for (let attempt = 0; attempt <= CONFIG.maxRetries; attempt++) {
      if (attempt > 0) {
        summary.retries = attempt;
        log('WARN', `Retry attempt ${attempt}/${CONFIG.maxRetries}...`, { delayMs: CONFIG.retryDelayMs });
        await new Promise((r) => setTimeout(r, CONFIG.retryDelayMs));
      }

      try {
        log('INFO', `Scraping Glints (attempt ${attempt + 1})...`);
        result = await scrapeGlints(maxJobs);
        lastError = null;
        break; // Success — exit retry loop
      } catch (err) {
        lastError = err;
        log('ERROR', `Scrape attempt ${attempt + 1} failed`, { error: err.message });
      }
    }

    // ── 5. Handle Final Failure ────────────────────────────────────────────
    if (lastError) {
      summary.status = 'failed';
      summary.error = lastError.message;
      log('ERROR', 'All retry attempts exhausted. Giving up.', { error: lastError.message });
    } else if (!result) {
      summary.status = 'failed';
      summary.error = 'Scraper returned null unexpectedly';
      log('ERROR', summary.error);
    } else {
      // ── 6. Bot Detection Flag ────────────────────────────────────────────
      if (result.botDetected) {
        summary.botDetected = true;
        log('WARN', '⚠️  Bot detection suspected — scraper returned zero results!');
      }

      summary.jobsScraped = result.jobs.length;
      log('INFO', `Scraped ${result.jobs.length} jobs from Glints`);

      // ── 7. Persist Results ───────────────────────────────────────────────
      if (result.jobs.length > 0) {
        const { inserted, skipped } = await saveJobs(result.jobs);
        summary.jobsInserted = inserted;
        summary.jobsSkipped = skipped;
        log('SUCCESS', `Saved to DB — inserted: ${inserted}, skipped (dups): ${skipped}`);
      }

      summary.status = result.botDetected ? 'warn:bot_detected' : 'success';
    }

    if (shouldDisconnect) {
      await mongoose.disconnect();
      log('INFO', 'MongoDB disconnected');
    }
  } catch (err) {
    summary.status = 'failed';
    summary.error = err.message;
    log('ERROR', 'Unexpected error in scraper runner', { error: err.message, stack: err.stack });
  } finally {
    // ── 8. Cleanup ─────────────────────────────────────────────────────────
    releaseLock();
    recordLastRun();
    summary.endTime = new Date().toISOString();
    const durationMs = new Date(summary.endTime) - startTime;
    log('INFO', `=== Scraper Run Ended [${runId}] ===`, {
      status: summary.status,
      durationMs,
      jobsInserted: summary.jobsInserted,
    });
  }

  return summary;
};

module.exports = { runScraper, CONFIG };
