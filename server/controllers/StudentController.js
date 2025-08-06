const Student = require('../models/Student');

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
    const userId = req.user._id;

    if (!name || !rollNo || !studentId) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const existingStudent = await Student.findOne({ user: userId });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists", success: false });
    }

    const student = new Student({
      user: userId,
      name,
      rollNo,
      studentId,
    });

    await student.save();

    return res.status(201).json({ student, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false, error: error.message });
  }
};

