import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';  // Import the CORS middleware

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // Enable JSON parsing

// Configure CORS to allow requests from http://localhost:8082
const corsOptions = {
  origin: 'http://localhost:8082',  // Only allow requests from the frontend
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
    const { eventName, eventDate, totalTickets, eventLocation, ticketsOpen } = req.body;

    console.log("Received event data:", req.body);

    // Ensure totalTickets is an integer
    const totalTicketsInt = parseInt(totalTickets, 10);
    if (isNaN(totalTicketsInt)) {
        console.error("Invalid totalTickets value:", totalTickets);
        return res.status(400).json({ error: 'Invalid totalTickets value' });
    }

    const query = 'INSERT INTO events (eventName, eventDate, totalTickets, eventLocation, ticketsOpen) VALUES (?, ?, ?, ?, ?)';
    
    try {
        const [result] = await pool.execute(query, [eventName, eventDate, totalTicketsInt, eventLocation, ticketsOpen]);
        console.log("Event inserted successfully, Insert ID:", result.insertId);
        res.status(200).json({
            message: "Event added successfully",
            eventId: result.insertId, 
            eventName,
            eventDate,
            totalTickets: totalTicketsInt,
            eventLocation,
            ticketsOpen
        });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: 'Error inserting event', details: err.message });
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
      const { eventId } = req.body;
      // Step 1: Check ticket availability
      const [event] = await pool.query("SELECT totalTickets FROM events WHERE eventId = ?", [eventId]);

      if (event.length === 0) {
          return res.status(404).json({ error: "Event not found" });
      }
      if (event[0].totalTickets <= 0) {
          return res.status(400).json({ error: "No tickets available" });
      }

      // Step 2: Update events table (decrement totalTickets)
      await pool.query("UPDATE events SET totalTickets = totalTickets - 1 WHERE eventId = ?", [eventId]);

      res.status(200).json({ message: "Ticket claimed successfully"});

  } catch (error) {
      console.error("Error claiming ticket:", error);
      res.status(500).json({ error: "Internal server error", details: error.message });
  }
});


//4️⃣ Unclaim a Ticket
app.post('/unclaimticket', async (req, res) => {
  const { eventId } = req.body;
  try {
      await pool.query("UPDATE events SET totalTickets = totalTickets + 1 WHERE eventId = ?", [eventId])
      res.status(200).send({ message: 'Ticket unclaimed' });
  } catch (err) {
      console.error("Error unclaiming ticket:", error);
      res.status(500).json({ error: "Internal server error", details: error.message });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});