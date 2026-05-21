const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { 
  getAllJobs, 
  recommendJobs, 
  getJobById,
  getAdminStats,
  deleteJob
} = require('../controllers/jobController');

// Browse semua lowongan (dengan filter & pagination)
router.get('/all', getAllJobs);

// Stats untuk Admin Dashboard
router.get('/admin/stats', getAdminStats);

// Route scraping lokal telah dihapus (DEPRECATED) karena diambil alih oleh Python Microservice

// Rekomendasi berdasarkan CV (PDF upload)
router.post('/recommend', upload.single('cv'), recommendJobs);

// Detail job by ID
router.get('/:id', getJobById);

// Delete job by ID
router.delete('/:id', deleteJob);

module.exports = router;
