const { runScraper } = require('../scraper/scraperRunner');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const manualScrape = async () => {
  try {
    console.log('🚀 Memulai Scraping Manual (Force)...');
    
    // Pastikan koneksi DB aktif
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('📡 Terhubung ke MongoDB');
    }

    const summary = await runScraper({ 
      maxJobs: 40, 
      force: true, 
      dbConnected: true 
    });

    console.log('\n--- RINGKASAN SCRAPING ---');
    console.log(`Status         : ${summary.status}`);
    console.log(`Total Scraped  : ${summary.jobsScraped}`);
    console.log(`Baru (Inserted): ${summary.jobsInserted}`);
    console.log(`Dilewati (Dups): ${summary.jobsSkipped}`);
    console.log(`Bot Detected   : ${summary.botDetected ? 'YA ⚠️' : 'Tidak'}`);
    console.log('--------------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Terjadi kesalahan fatal:', err);
    process.exit(1);
  }
};

manualScrape();
