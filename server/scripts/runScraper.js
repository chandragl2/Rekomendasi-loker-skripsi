/**
 * runScraper.js — CLI entry point for the Glints scraper automation agent
 *
 * Usage:
 *   node server/scripts/runScraper.js              → default (30 jobs)
 *   node server/scripts/runScraper.js --max 40     → custom job limit
 *   node server/scripts/runScraper.js --force      → bypass rate-limit check
 *
 * Environment:
 *   Requires MONGO_URI in server/.env
 */

'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { runScraper } = require('../scraper/scraperRunner');

// ─── Parse CLI Args ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const maxIndex = args.indexOf('--max');
const maxJobs = maxIndex !== -1 && args[maxIndex + 1] ? parseInt(args[maxIndex + 1], 10) : 30;
const force = args.includes('--force');

// ─── Run ──────────────────────────────────────────────────────────────────────
(async () => {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   Glints Scraper — Automation Agent          ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`Options: maxJobs=${maxJobs}, force=${force}`);
  console.log('');

  try {
    const summary = await runScraper({ maxJobs, force, dbConnected: false });
    console.log('\n── Run Summary ──────────────────────────────');
    console.log(JSON.stringify(summary, null, 2));

    // Exit with non-zero code on failure so OS schedulers can detect issues
    process.exit(summary.status === 'failed' ? 1 : 0);
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  }
})();
