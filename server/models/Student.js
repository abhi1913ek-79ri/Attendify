const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  studentId: { type: String, required: true },
  profileImageUrl: { type: String, default: '' },

  // Allow dynamic subjects like { math: "90%", science: "80%" }
  subjects: {
    type: Map,
    of: String,
    default: {},
  },

  // For future attendance tracking
  // attendance: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
