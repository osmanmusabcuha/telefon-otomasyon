const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);
router.post('/register', register);

module.exports = router; 