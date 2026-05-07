const express = require('express');
const router = express.Router();
const { getCandidates, getRecommendations } = require('../controllers/candidateController');

router.get('/', getCandidates);
router.post('/recommend', getRecommendations);

module.exports = router;
