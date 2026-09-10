const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authVerification = require('../middleware/auth');

// Optional auth for GET /api/stores. If token is passed, it works, if not, no user_rating is added.
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const jwt = require('jsonwebtoken');
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) { }
    next();
};

router.get('/', optionalAuth, storeController.getStores);
router.get('/search', storeController.searchStores); // e.g., /api/stores/search?name=a&address=b

module.exports = router;
