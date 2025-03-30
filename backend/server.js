import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';  // Import the CORS middleware

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // Enable JSON parsing

// Configure CORS to allow requests from http://localhost:8080
const corsOptions = {
  origin: 'http://localhost:8080',  // Only allow requests from the frontend
};
app.use(cors(corsOptions));  // Enable CORS middleware

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 1️⃣ Add an Event
app.post('/addevent', async (req, res) => {
  try {
    const { eventName, eventDate, totalTickets } = req.body;
    const [result] = await pool.query(
      "INSERT INTO Events (eventName, eventDate, totalTickets) VALUES (?, ?, ?)",
      [eventName, eventDate, totalTickets]
    );
    res.json({ message: 'Event added successfully', eventId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2️⃣ Get All Events
app.get('/api/getEvents', async (req, res) => {
  try {
    const [events] = await pool.query('SELECT * FROM events');
    console.log("Events fetched:", events);
    res.json(events);
  } catch (err) {
    console.error("Database Query Error:", err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// 3️⃣ Claim a Ticket
app.post('/claimticket', async (req, res) => {
  try {
    const { netId, eventId } = req.body;
    const [event] = await pool.query("SELECT totalTickets FROM events WHERE eventId = ?", [eventId]);
    if (event.length === 0 || event[0].totalTickets <= 0) {
      return res.status(400).json({ error: "No tickets available" });
    }

    const ticketId = `TICKET-${Date.now()}`;
    const qrCode = `QR-${ticketId}`;

    await pool.query("INSERT INTO Tickets (ticketId, eventId, ownerNetId, qrCode) VALUES (?, ?, ?, ?)", 
      [ticketId, eventId, netId, qrCode]
    );

    await pool.query("UPDATE Events SET totalTickets = totalTickets - 1 WHERE eventId = ?", [eventId]);

    res.json({ message: "Ticket claimed successfully", ticketId, qrCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4️⃣ Unclaim a Ticket
app.post('/unclaimticket', async (req, res) => {
  try {
    const { netId, eventId } = req.body;
    const [ticket] = await pool.query(
      "SELECT ticketId FROM Tickets WHERE ownerNetId = ? AND eventId = ? LIMIT 1",
      [netId, eventId]
    );

    if (ticket.length === 0) {
      return res.status(400).json({ error: "No ticket found for this user and event" });
    }

    const ticketId = ticket[0].ticketId;

    await pool.query("DELETE FROM Tickets WHERE ticketId = ?", [ticketId]);

    await pool.query("UPDATE events SET totalTickets = totalTickets + 1 WHERE eventId = ?", [eventId]);

    res.json({ message: "Ticket unclaimed successfully", ticketId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});