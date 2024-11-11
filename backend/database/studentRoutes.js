// API FOR STUDENT DATA

const express = require('express');
const router = express.Router();
const Student = require('../database/studentData');

// POST route to add a new student
router.post('/add', async (req, res) => {
  const { netID, fullName, peopleSoftID, email, status } = req.body;
  try {
    const newStudent = new Student({
      netID,
      fullName,
      peopleSoftID,
      email,
      status
    });
    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding student', error: err.message });
  }
});

// GET route to fetch student data by netID
router.get('/:netID', async (req, res) => {
  try {
    const student = await Student.findOne({ netID: req.params.netID });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student data', error: err.message });
  }
});

// PUT route to update student data
router.put('/update/:netID', async (req, res) => {
  const { fullName, peopleSoftID, email, status } = req.body;
  try {
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
    res.status(500).json({ message: 'Error updating student data', error: err.message });
  }
});

module.exports = router;