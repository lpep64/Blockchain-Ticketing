const Student = require('../models/studentModel');

// Add a new student
exports.addStudent = async (req, res) => {
  try {
    const { netID, fullName, peopleSoftID, email, status } = req.body;
    const newStudent = new Student({ netID, fullName, peopleSoftID, email, status });
    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get student data by netID
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ netID: req.params.netID });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update student data
exports.updateStudent = async (req, res) => {
  try {
    const { fullName, peopleSoftID, email, status } = req.body;
    const updatedStudent = await Student.findOneAndUpdate(
      { netID: req.params.netID },
      { fullName, peopleSoftID, email, status },
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student data updated successfully', student: updatedStudent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};