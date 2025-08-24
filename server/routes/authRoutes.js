const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');

const { registerUser, loginUser, userProfile, sendOTP, verifyOTP} = require('../controllers/AuthController');
const { verify } = require('jsonwebtoken');

// POST /api/students
router.post('/register', registerUser);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

const { registerUser, loginUser, userProfile} = require('../controllers/AuthController');

// POST /api/students
router.post('/register', registerUser);

router.post('/login', loginUser);
router.get('/profile',protect, userProfile);

module.exports = router;
