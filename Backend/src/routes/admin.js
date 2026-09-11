const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authVerification = require('../middleware/auth');

// Middleware: only allow admin role
const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
};

// Dashboard stats
router.get('/dashboard', authVerification, adminOnly, adminController.getDashboard);

// User management
router.get('/users',     authVerification, adminOnly, adminController.getUsers);
router.post('/users',    authVerification, adminOnly, adminController.createUser);
router.get('/users/:id', authVerification, adminOnly, adminController.getUserById);
router.put('/users/:id', authVerification, adminOnly, adminController.updateUser);
router.delete('/users/:id', authVerification, adminOnly, adminController.deleteUser);

// Store management
router.post('/stores',   authVerification, adminOnly, adminController.createStore);
router.put('/stores/:id', authVerification, adminOnly, adminController.updateStore);
router.delete('/stores/:id', authVerification, adminOnly, adminController.deleteStore);

module.exports = router;
