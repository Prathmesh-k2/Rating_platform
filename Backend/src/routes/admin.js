const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { validateUser } = require('../validators/userValidator');

// User routes
router.post('/users', validateUser, adminController.createUser);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);

// Store routes
router.post('/stores', adminController.createStore);

// Dashboard routes
router.get('/dashboard', adminController.getDashboard);

module.exports = router;
