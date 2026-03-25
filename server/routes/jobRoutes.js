const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { scrapeJobs, scrapeRealtime, getAllJobs, recommendJobs, getJobById } = require('../controllers/jobController');

// Browse semua lowongan (dengan filter & pagination)
router.get('/all', getAllJobs);

// Seed DB dari static data + rebuild TF-IDF
router.get('/scrape', scrapeJobs);

// Scrape REALTIME dari Glints.com + gabung seed + rebuild TF-IDF
router.post('/scrape-realtime', scrapeRealtime);

// Rekomendasi berdasarkan CV (PDF upload)
router.post('/recommend', upload.single('cv'), recommendJobs);

// Detail job by ID
router.get('/:id', getJobById);

module.exports = router;
