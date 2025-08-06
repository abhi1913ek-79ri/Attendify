const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true }, // e.g. "2025-08-05"
  status: {
    type: String,
    enum: ['present', 'absent'],
    default: 'present'
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
