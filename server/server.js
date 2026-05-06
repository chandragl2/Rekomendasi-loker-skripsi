const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/jobs', jobRoutes);

// ─── Scraper Automation Agent ──────────────────────────────────────────────────
// Runs in the background every 10 minutes. First execution is delayed 30s after
// server boot to avoid competing with startup I/O.
const { runScraper } = require('./scraper/scraperRunner');

const SCRAPER_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

const startScraperScheduler = () => {
  console.log('🕷️  Scraper scheduler initialised — first run in 30s, then every 10 min.');

  // First run — delayed to let the server finish booting
  const firstRun = setTimeout(async () => {
    await runScraper({ maxJobs: 30, dbConnected: true });
  }, 30 * 1000);
  firstRun.unref(); // Don't prevent process exit

  // Recurring runs
  const interval = setInterval(async () => {
    await runScraper({ maxJobs: 30, dbConnected: true });
  }, SCRAPER_INTERVAL_MS);
  interval.unref(); // Don't prevent process exit
};

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// On Vercel, we export the app instead of starting a persistent server
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    startScraperScheduler();
  });
}
