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
const { updateSubjects } = require('../controllers/StudentController');
const protect = require('../middlewares/authMiddleware'); // your JWT middleware
const { uploadSingle } = require('../config/cloudinary');

// Routes
router.post('/test-upload', protect, uploadSingle('profileImage'), testUpload);
router.post('/add', protect, uploadSingle('profileImage'), addStudent);
router.get('/profile', protect, getStudentProfile);
router.put('/profile', protect, express.json(), require('../controllers/StudentController').updateProfile);
router.get('/getAllStudents', getAllStudents);
router.get('/:rollNo', getStudentById);

// Image management routes
router.put('/profile-image', protect, uploadSingle('profileImage'), updateProfileImage);
router.delete('/profile-image', protect, deleteProfileImage);

// Update subjects - add or remove subjects for the logged in student's profile
router.patch('/subjects', protect, express.json(), updateSubjects);

module.exports = router;
