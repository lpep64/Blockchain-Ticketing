const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Route to add a new student
router.post('/add', studentController.addStudent);

// Route to get student data by netID
router.get('/:netID', studentController.getStudent);

// Route to update student data
router.put('/update/:netID', studentController.updateStudent);

module.exports = router;