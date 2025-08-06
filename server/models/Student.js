const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  studentId: { type: Number, default: 0 },
  profileImageUrl: { type: String, default: '' },
  subjects: {type: Object, default:{}},
  // attendance:{type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true},
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
