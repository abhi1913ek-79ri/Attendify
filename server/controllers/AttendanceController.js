const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const mongoose = require('mongoose');

// @desc    Get attendance for a specific student
// @route   GET /api/attendance/:rollNo
// @access  Private
const getAttendance = async (req, res) => {
  try {
    const { rollNo } = req.params;

    // First try to find student by MongoDB _id, then by rollNo field
    let student;
    
    if (mongoose.Types.ObjectId.isValid(rollNo)) {
      // If it's a valid ObjectId, search by _id
      student = await Student.findById(rollNo);
    }
    
    // If not found by _id or not a valid ObjectId, search by rollNo field
    if (!student) {
      student = await Student.findOne({ rollNo: rollNo });
    }

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find attendance record using the student's _id
    let attendance = await Attendance.findOne({ student: student._id });

    // If no attendance record exists, create a default one
    if (!attendance) {
      attendance = new Attendance({
        student: student._id,
        daily: new Map(),
        subjects: new Map(),
        classes: new Map(), // Initialize empty classes Map
        overall: {
          present: 0,
          total: 0,
          percentage: 0
        }
      });

      // Initialize subjects from student record
      if (student.subjects && student.subjects.size > 0) {
        // Student.subjects is a Map with subject names as keys
        for (const [subjectName, _] of student.subjects) {
          attendance.subjects.set(subjectName, {
            present: 0,
            total: 0
          });
        }
      }

      await attendance.save();
    }

    // Convert Maps to Objects for JSON response
    const attendanceData = {
      _id: attendance._id,
      student: attendance.student,
      daily: Object.fromEntries(attendance.daily || new Map()),
      subjects: Object.fromEntries(attendance.subjects || new Map()),
      classes: Object.fromEntries(attendance.classes || new Map()), // Return stored classes
      overall: attendance.overall,
      createdAt: attendance.createdAt,
      updatedAt: attendance.updatedAt
    };

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ 
      message: 'Server error while fetching attendance',
      error: error.message 
    });
  }
};

// @desc    Update attendance for a specific student
// @route   PUT /api/attendance/:rollNo
// @access  Private
const updateAttendance = async (req, res) => {
  try {
    const { rollNo } = req.params;
    const { daily, subjects, overall, classes } = req.body;

    console.log('Update request for rollNo:', rollNo);
    console.log('Request body:', req.body);

    // First try to find student by MongoDB _id, then by rollNo field
    let student;
    
    if (mongoose.Types.ObjectId.isValid(rollNo)) {
      // If it's a valid ObjectId, search by _id
      student = await Student.findById(rollNo);
    }
    
    // If not found by _id or not a valid ObjectId, search by rollNo field
    if (!student) {
      student = await Student.findOne({ rollNo: rollNo });
    }

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log('Found student:', { _id: student._id, rollNo: student.rollNo, name: student.name });

    // Validate required fields
    if (!daily || !subjects || !overall) {
      return res.status(400).json({ 
        message: 'Missing required fields: daily, subjects, and overall are required' 
      });
    }

    // Validate overall stats
    if (typeof overall.present !== 'number' || typeof overall.total !== 'number') {
      return res.status(400).json({ 
        message: 'Overall present and total must be numbers' 
      });
    }

    // Calculate percentage
    const calculatedPercentage = overall.total > 0 ? (overall.present / overall.total) * 100 : 0;

    // Find attendance record using student's _id
    let attendance = await Attendance.findOne({ student: student._id });

    if (!attendance) {
      // Create new attendance record
      attendance = new Attendance({
        student: student._id,
        daily: new Map(),
        subjects: new Map(),
        classes: new Map(), // Initialize empty classes Map
        overall: {
          present: overall.present,
          total: overall.total,
          percentage: calculatedPercentage
        }
      });
    } else {
      // Ensure backward compatibility - initialize classes if it doesn't exist
      if (!attendance.classes) {
        attendance.classes = new Map();
      }
    }

    // Update daily attendance - handle null/undefined daily
    if (daily && typeof daily === 'object') {
      attendance.daily = new Map(Object.entries(daily));
    }

    // Update subject-wise attendance - handle null/undefined subjects
    if (subjects && typeof subjects === 'object') {
      const subjectMap = new Map();
      for (const [subjectName, subjectData] of Object.entries(subjects)) {
        // Validate subject data
        if (subjectData && typeof subjectData === 'object') {
          if (typeof subjectData.present !== 'number' || typeof subjectData.total !== 'number') {
            return res.status(400).json({ 
              message: `Invalid data for subject ${subjectName}: present and total must be numbers` 
            });
          }

          subjectMap.set(subjectName, {
            present: subjectData.present,
            total: subjectData.total
          });
        }
      }
      attendance.subjects = subjectMap;
    }

    // Update classes metadata - handle null/undefined classes
    if (classes && typeof classes === 'object') {
      const classMap = new Map();
      for (const [classKey, classData] of Object.entries(classes)) {
        // Validate class data
        if (classData && typeof classData === 'object') {
          classMap.set(classKey, {
            duration: classData.duration || 1,
            conducted: classData.conducted !== false, // default to true
            date: classData.date || new Date().toISOString().split('T')[0]
          });
        }
      }
      attendance.classes = classMap;
    }

    // Update overall stats
    attendance.overall = {
      present: overall.present,
      total: overall.total,
      percentage: calculatedPercentage
    };

    // Save updated attendance
    await attendance.save();

    console.log('Attendance updated successfully');

    // Convert Maps to Objects for JSON response
    const attendanceData = {
      _id: attendance._id,
      student: attendance.student,
      daily: Object.fromEntries(attendance.daily || new Map()),
      subjects: Object.fromEntries(attendance.subjects || new Map()),
      classes: Object.fromEntries(attendance.classes || new Map()), // Return stored classes from database
      overall: attendance.overall,
      createdAt: attendance.createdAt,
      updatedAt: attendance.updatedAt
    };

    res.status(200).json({
      message: 'Attendance updated successfully',
      data: attendanceData
    });

  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ 
      message: 'Server error while updating attendance',
      error: error.message 
    });
  }
};

// @desc    Delete attendance record for a student
// @route   DELETE /api/attendance/:rollNo
// @access  Private
const deleteAttendance = async (req, res) => {
  try {
    const { rollNo } = req.params;

    // First try to find student by MongoDB _id, then by rollNo field
    let student;
    
    if (mongoose.Types.ObjectId.isValid(rollNo)) {
      student = await Student.findById(rollNo);
    }
    
    if (!student) {
      student = await Student.findOne({ rollNo: rollNo });
    }

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find and delete attendance record using student's _id
    const attendance = await Attendance.findOneAndDelete({ student: student._id });

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json({ 
      message: 'Attendance record deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ 
      message: 'Server error while deleting attendance',
      error: error.message 
    });
  }
};

// @desc    Get attendance statistics for a student
// @route   GET /api/attendance/:rollNo/stats
// @access  Private
const getAttendanceStats = async (req, res) => {
  try {
    const { rollNo } = req.params;

    // First try to find student by MongoDB _id, then by rollNo field
    let student;
    
    if (mongoose.Types.ObjectId.isValid(rollNo)) {
      student = await Student.findById(rollNo);
    }
    
    if (!student) {
      student = await Student.findOne({ rollNo: rollNo });
    }

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find attendance record using student's _id
    const attendance = await Attendance.findOne({ student: student._id }).populate('student', 'name course rollNo');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Calculate additional statistics
    const dailyMap = attendance.daily || new Map();
    const totalDays = dailyMap.size;
    const presentDays = Array.from(dailyMap.values()).filter(status => status === 'present').length;
    const absentDays = totalDays - presentDays;

    // Subject-wise statistics
    const subjectStats = [];
    const subjectsMap = attendance.subjects || new Map();
    
    for (const [subjectName, subjectData] of subjectsMap) {
      const subjectPercentage = subjectData.total > 0 ? ((subjectData.present / subjectData.total) * 100).toFixed(1) : '0.0';
      subjectStats.push({
        subject: subjectName,
        present: subjectData.present,
        total: subjectData.total,
        percentage: parseFloat(subjectPercentage),
        status: parseFloat(subjectPercentage) >= 75 ? 'Good' : 'Critical'
      });
    }

    const stats = {
      student: attendance.student,
      overall: attendance.overall || { present: 0, total: 0, percentage: 0 },
      dailyStats: {
        totalDays,
        presentDays,
        absentDays,
        dailyPercentage: totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : '0.0'
      },
      subjectStats,
      lastUpdated: attendance.updatedAt
    };

    res.status(200).json(stats);

  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ 
      message: 'Server error while fetching attendance statistics',
      error: error.message 
    });
  }
};

module.exports = {
  getAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceStats
};