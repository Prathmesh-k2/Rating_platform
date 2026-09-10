const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/storeOwnerController');
const authVerification = require('../middleware/auth');

router.get('/dashboard', authVerification, storeOwnerController.getDashboard);

module.exports = router;
