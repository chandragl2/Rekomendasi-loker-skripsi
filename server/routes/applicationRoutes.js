const express = require('express');
const {
  applyJob,
  getCompanyApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const companyAuth = require('../middleware/companyAuth');

const router = express.Router();

router.post('/apply', applyJob);
router.get('/company', companyAuth, getCompanyApplications);
router.patch('/:id/status', companyAuth, updateApplicationStatus);

module.exports = router;
