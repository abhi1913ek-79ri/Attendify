const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },

  // 1. Daily attendance logs like: { "2025-08-07": "present", "2025-08-06": "absent" }
  daily: {
    type: Map,
    of: {
      type: String, // "present" or "absent"
      enum: ['present', 'absent'],
    },
    default: {},
  },

  // 2. Subject-wise attendance data (math: { present: 20, total: 25 })
  subjects: {
    type: Map,
    of: new mongoose.Schema({
      present: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    }),
    default: {},
  },

  // 3. Class metadata for frontend (duration, date info)
  classes: {
    type: Map,
    of: new mongoose.Schema({
      duration: { type: Number, default: 1 },
      conducted: { type: Boolean, default: true },
      date: { type: String, required: true },
    }),
    default: {},
  },

  // 4. Overall stats
  overall: {
    present: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },

}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
