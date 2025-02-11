import express from 'express';
import db from '../config/connectDB.js';

const router = express.Router();

// Claim a ticket
router.post('/claim', async (req, res) => { 
  const { netid, full_name, peoplesoft_id, uconn_email, student_status, event_id } = req.body;

  try {
    // Start a transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Check if event exists and has available tickets
      const [eventResult] = await connection.query(
        'SELECT available_tickets FROM Events WHERE event_id = ?',
        [event_id]
      );

      if (eventResult.length === 0 || eventResult[0].available_tickets <= 0) {
        await connection.rollback();
        return res.status(400).json({ message: 'Event not found or no tickets available' });
      }

      // Check if student exists
      const [studentResult] = await connection.query(
        'SELECT claimed_tickets FROM Students WHERE netid = ?',
        [netid]
      );

      if (studentResult.length === 0) {
        // Student does not exist, create them with the ticket
        const insertStudentQuery = `
          INSERT INTO Students (netid, full_name, peoplesoft_id, uconn_email, student_status, claimed_tickets)
          VALUES (?, ?, ?, ?, ?, JSON_ARRAY(?))`;
        await connection.query(insertStudentQuery, 
          [netid, full_name, peoplesoft_id, uconn_email, student_status, event_id]
        );
      } else {
        // Student exists, check and update their claimed_tickets
        const existingTickets = JSON.parse(studentResult[0].claimed_tickets);

        if (existingTickets.includes(event_id)) {
          await connection.rollback();
          return res.status(400).json({ message: 'Ticket already claimed' });
        }

        existingTickets.push(event_id);
        await connection.query(
          'UPDATE Students SET claimed_tickets = ? WHERE netid = ?',
          [JSON.stringify(existingTickets), netid]
        );
      }

      // Update available tickets for the event
      await connection.query(
        'UPDATE Events SET available_tickets = available_tickets - 1 WHERE event_id = ?',
        [event_id]
      );

      await connection.commit();
      res.status(201).json({ message: 'Ticket claimed successfully' });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;