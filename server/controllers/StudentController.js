const Student = require('../models/Student');
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
    const { name, rollNo, studentId } = req.body;
    let { subjects } = req.body;
    const userId = req.user._id;

    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    // Check required fields
    if (!name || !rollNo || !studentId) {
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
      rollNo,
      studentId,
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
    const currentStudent = await Student.findOne({ studentId: req.params.studentId });

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
