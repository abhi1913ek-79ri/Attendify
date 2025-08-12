const express = require('express');
const router = express.Router();
const {getAttendance, updateAttendance} = require('../controllers/AttendanceController');
const protect = require('../middlewares/authMiddleware'); // your JWT middleware

router.get('/:studentId', getAttendance);
router.put('/:studentId', protect, updateAttendance);


module.exports = router;
