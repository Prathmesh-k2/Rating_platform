const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authVerification = require('../middleware/auth');

router.post('/', authVerification, ratingController.upsertRating);

module.exports = router;
