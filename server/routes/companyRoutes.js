const express = require('express');
const {
  registerCompany,
  loginCompany,
  getCompanyMe,
  createCompanyJob,
  getCompanyJobs,
} = require('../controllers/companyController');
const companyAuth = require('../middleware/companyAuth');

const router = express.Router();

router.post('/register', registerCompany);
router.post('/login', loginCompany);
router.get('/me', companyAuth, getCompanyMe);
router.post('/jobs', companyAuth, createCompanyJob);
router.get('/jobs', companyAuth, getCompanyJobs);

module.exports = router;
