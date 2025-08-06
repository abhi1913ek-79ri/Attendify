const express = require('express');
const router = express.Router();
const {getStudentProfile, addStudent} = require('../controllers/studentController');
const protect = require('../middlewares/authMiddleware'); // your JWT middleware

router.post('/add', protect, addStudent);
router.get('/profile', protect, getStudentProfile);

module.exports = router;
