const express = require('express');
const router = express.Router();
const {getAttendance, updateAttendance} = require('../controllers/AttendanceController');
const protect = require('../middlewares/authMiddleware'); // your JWT middleware

router.get('/:rollNo', getAttendance);
router.put('/:rollNo', protect, updateAttendance);


module.exports = router;
