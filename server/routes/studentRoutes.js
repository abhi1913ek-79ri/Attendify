const express = require('express');
const router = express.Router();
const {getStudentProfile, addStudent, getAllStudents,getStudentById} = require('../controllers/studentController');
const protect = require('../middlewares/authMiddleware'); // your JWT middleware

router.post('/add', protect, addStudent);
router.get('/profile', protect, getStudentProfile);
router.get('/getAllStudents', getAllStudents);
router.get('/:studentId', getStudentById);

module.exports = router;
