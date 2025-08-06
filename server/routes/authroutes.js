const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const { registerUser, loginUser, userProfile} = require('../controllers/AuthController');

// POST /api/students
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile',protect, userProfile);

module.exports = router;
