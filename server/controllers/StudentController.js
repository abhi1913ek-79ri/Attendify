const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { deleteImage, extractPublicId } = require('../config/cloudinary');

// Test endpoint for file upload debugging
exports.testUpload = async (req, res) => {
  try {
    console.log('Test upload - req.body:', req.body);
    console.log('Test upload - req.file:', req.file);
    
    res.json({
      message: 'Test upload endpoint',
      body: req.body,
      file: req.file,
      hasFile: !!req.file,
      success: true
    });
  } catch (error) {
    console.error('Test upload error:', error);
    res.status(500).json({ message: 'Test upload failed', error: error.message });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate('user');
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
}
exports.addStudent = async (req, res) => {
  try {
    const { name, course, rollNo } = req.body;
    let { subjects } = req.body;
    const userId = req.user._id;

    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    // Check required fields
    if (!name || !course || !rollNo) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    // Prevent duplicate student entry for the user
    const existingStudent = await Student.findOne({ user: userId });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists", success: false });
    }

    // Parse subjects if it's a JSON string (from FormData)
    if (typeof subjects === 'string') {
      try {
        subjects = JSON.parse(subjects);
      } catch (error) {
        console.error('Error parsing subjects:', error);
        subjects = {};
      }
    }

    // Get profile image URL from uploaded file (if any)
    const profileImageUrl = req.file ? req.file.path : '';
    
    console.log('Profile image URL:', profileImageUrl);

    // Create new student with profile image
    const student = new Student({
      user: userId,
      name,
      course,
      rollNo,
      profileImageUrl,
      subjects: subjects || {}, // should be an object: { math: '90%', science: '85%' } etc.
    });

    await student.save();
    console.log('Student saved:', student);

    return res.status(201).json({ student, success: true });

  } catch (error) {
    console.error('Error in addStudent:', error);
    return res.status(500).json({ message: "Server Error", success: false, error: error.message });
  }
};
exports.getAllStudents = async(req,res) => {
  try {
    const students = await Student.find()
    if (!students || students.length === 0) return res.status(404).json({ message: "No student found" });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
}

// controller/studentController.js

exports.getStudentById = async (req, res) => {
  try {
    const currentStudent = await Student.findOne({ rollNo: req.params.rollNo });

    if (!currentStudent) {
      return res.status(404).json({ message: "Student not found", success: false });
    }

    res.status(200).json({ currentStudent, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Update student profile image
exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find the student
    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ message: "Student not found", success: false });
    }

    // Delete old image if exists
    if (student.profileImageUrl) {
      try {
        const publicId = extractPublicId(student.profileImageUrl);
        if (publicId) {
          await deleteImage(publicId);
        }
      } catch (error) {
        console.log('Error deleting old image:', error);
        // Continue with update even if deletion fails
      }
    }

    // Update with new image URL
    const profileImageUrl = req.file ? req.file.path : '';
    student.profileImageUrl = profileImageUrl;
    await student.save();

    res.status(200).json({ 
      message: "Profile image updated successfully", 
      student,
      success: true 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Delete student profile image
exports.deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find the student
    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ message: "Student not found", success: false });
    }

    // Delete image from Cloudinary if exists
    if (student.profileImageUrl) {
      try {
        const publicId = extractPublicId(student.profileImageUrl);
        if (publicId) {
          await deleteImage(publicId);
        }
      } catch (error) {
        console.log('Error deleting image:', error);
      }
    }

    // Remove image URL from database
    student.profileImageUrl = '';
    await student.save();

    res.status(200).json({ 
      message: "Profile image deleted successfully", 
      student,
      success: true 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Update student profile (name, course, semester)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const student = await Student.findOne({ user: userId });
    if (!student) return res.status(404).json({ message: 'Student not found', success: false });

    const { name, course, semester } = req.body || {};
    if (name) student.name = name;
    if (course !== undefined) student.course = course;
    if (semester !== undefined) student.semester = semester;

    await student.save();
    return res.status(200).json({ message: 'Profile updated', student, success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Server Error', success: false, error: error.message });
  }
};

// Update subjects: add or remove subject entries on the student's subjects map
exports.updateSubjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const { add = {}, remove = [] } = req.body || {};

    const student = await Student.findOne({ user: userId });
    if (!student) return res.status(404).json({ message: 'Student not found', success: false });

    // Ensure map exists
    if (!student.subjects) student.subjects = {};

    // Add/update subjects
    Object.entries(add || {}).forEach(([name, code]) => {
      if (name && code !== undefined) {
        student.subjects.set ? student.subjects.set(name, code) : (student.subjects[name] = code);
      }
    });

    // Remove specified subjects
    (remove || []).forEach((name) => {
      if (!name) return;
      if (student.subjects.delete) student.subjects.delete(name);
      else delete student.subjects[name];
    });

    await student.save();

    // If any subjects were removed, purge their attendance entries from Attendance
    if (Array.isArray(remove) && remove.length > 0) {
      try {
        const attendance = await Attendance.findOne({ student: student._id });
        if (attendance) {
          let changed = false;

          // Remove daily keys that belong to removed subjects (keys like "Subject_YYYY-MM-DD")
          for (const subj of remove) {
            if (!subj) continue;
            // attendance.daily is a Map
            if (attendance.daily && typeof attendance.daily.forEach === 'function') {
              const keysToDelete = [];
              attendance.daily.forEach((val, key) => {
                if (String(key).startsWith(`${subj}_`)) {
                  keysToDelete.push(key);
                }
              });
              keysToDelete.forEach((k) => {
                attendance.daily.delete(k);
                changed = true;
              });
            }

            // Remove subject summary entry
            if (attendance.subjects && typeof attendance.subjects.delete === 'function') {
              if (attendance.subjects.has(subj)) {
                attendance.subjects.delete(subj);
                changed = true;
              }
            } else if (attendance.subjects && attendance.subjects[subj]) {
              delete attendance.subjects[subj];
              changed = true;
            }
          }

          // Recalculate overall stats from remaining subjects
          if (changed) {
            let totalPresent = 0;
            let totalClasses = 0;
            if (attendance.subjects && typeof attendance.subjects.forEach === 'function') {
              attendance.subjects.forEach((subVal) => {
                totalPresent += (subVal.present || 0);
                totalClasses += (subVal.total || 0);
              });
            } else if (attendance.subjects && typeof attendance.subjects === 'object') {
              Object.values(attendance.subjects).forEach((subVal) => {
                totalPresent += (subVal.present || 0);
                totalClasses += (subVal.total || 0);
              });
            }

            attendance.overall = {
              present: totalPresent,
              total: totalClasses,
              percentage: totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0,
            };

            await attendance.save();
          }
        }
      } catch (err) {
        console.error('Error purging attendance for removed subjects:', err);
        // don't fail the whole request if cleanup fails; return student update success
      }
    }

    return res.status(200).json({ message: 'Subjects updated', student, success: true });
  } catch (error) {
    console.error('Error in updateSubjects:', error);
    return res.status(500).json({ message: 'Server Error', success: false, error: error.message });
  }
};
