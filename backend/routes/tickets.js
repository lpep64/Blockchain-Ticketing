const express = require('express');
const router = express.Router();
const db = require('../config/connectDB'); // MySQL connection

// Claim a ticket
router.post('/claim', async (req, res) => { // TODO: Check this is the right path
  const { netid, full_name, peoplesoft_id, uconn_email, student_status, event_id } = req.body;

  try {
    // Check if student exists
    const [studentResult] = await db.query('SELECT claimed_tickets FROM Students WHERE netid = ?', [netid]);

    if (studentResult.length === 0) {
      // Student does not exist, create them with an empty ticket array
      const insertStudentQuery = `
        INSERT INTO Students (netid, full_name, peoplesoft_id, uconn_email, student_status, claimed_tickets)
        VALUES (?, ?, ?, ?, ?, JSON_ARRAY(?))`;
      await db.query(insertStudentQuery, [netid, full_name, peoplesoft_id, uconn_email, student_status, event_id]);
    } else {
      // Student exists, update their claimed_tickets array
      const existingTickets = JSON.parse(studentResult[0].claimed_tickets); // Convert JSON to array

      if (!existingTickets.includes(event_id)) {
        existingTickets.push(event_id); // Add new ticket ID
        const updateQuery = `UPDATE Students SET claimed_tickets = ? WHERE netid = ?`;
        await db.query(updateQuery, [JSON.stringify(existingTickets), netid]);
      } else {
        return res.status(400).json({ message: 'Ticket already claimed' });
      }
    }

    res.status(201).json({ message: 'Ticket claimed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;