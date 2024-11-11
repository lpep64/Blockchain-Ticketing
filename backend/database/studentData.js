// STUDENT DATA MODEL

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  netID: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  peopleSoftID: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;