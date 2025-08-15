const express = require('express');
const router = express.Router();
const {
  getStudentProfile, 
  addStudent, 
  getAllStudents, 
  getStudentById,
  updateProfileImage,
  deleteProfileImage,
  testUpload
} = require('../controllers/StudentController');
const protect = require('../middlewares/authMiddleware'); // your JWT middleware
const { uploadSingle } = require('../config/cloudinary');

// Routes
router.post('/test-upload', protect, uploadSingle('profileImage'), testUpload);
router.post('/add', protect, uploadSingle('profileImage'), addStudent);
router.get('/profile', protect, getStudentProfile);
router.get('/getAllStudents', getAllStudents);
router.get('/:studentId', getStudentById);

// Image management routes
router.put('/profile-image', protect, uploadSingle('profileImage'), updateProfileImage);
router.delete('/profile-image', protect, deleteProfileImage);

module.exports = router;
