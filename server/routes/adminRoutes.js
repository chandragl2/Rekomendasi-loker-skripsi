const express = require('express');
const {
  changeAdminPassword,
  getAdminActivity,
  getAdminCompanies,
  loginAdmin,
} = require('../controllers/adminController');
const { adminAuth } = require('../middleware/adminAuth');

const router = express.Router();

router.post('/login', loginAdmin);
router.put('/change-password', adminAuth, changeAdminPassword);
router.get('/activity', getAdminActivity);
router.get('/companies', getAdminCompanies);

module.exports = router;
