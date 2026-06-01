const express = require('express');
const {
  getAdminActivity,
  getAdminCompanies,
} = require('../controllers/adminController');

const router = express.Router();

router.get('/activity', getAdminActivity);
router.get('/companies', getAdminCompanies);

module.exports = router;
