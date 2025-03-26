import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json()); // Enable JSON parsing

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
app.get('/getevents', async (req, res) => {
    try {
        const [events] = await pool.query("SELECT * FROM Events");
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3️⃣ Claim a Ticket
app.post('/claimticket', async (req, res) => {
    try {
        const { netId, eventId } = req.body;

        // Check if there are available tickets
        const [event] = await pool.query("SELECT totalTickets FROM Events WHERE eventId = ?", [eventId]);
        if (event.length === 0 || event[0].totalTickets <= 0) {
            return res.status(400).json({ error: "No tickets available" });
        }

        // Generate a random ticket ID (You may want a more robust method)
        const ticketId = `TICKET-${Date.now()}`;
        const qrCode = `QR-${ticketId}`;

        await pool.query("INSERT INTO Tickets (ticketId, eventId, ownerNetId, qrCode) VALUES (?, ?, ?, ?)", 
            [ticketId, eventId, netId, qrCode]
        );

        // Decrease the ticket count
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

        // Find the ticket for this user and event
        const [ticket] = await pool.query(
            "SELECT ticketId FROM Tickets WHERE ownerNetId = ? AND eventId = ? LIMIT 1",
            [netId, eventId]
        );

        if (ticket.length === 0) {
            return res.status(400).json({ error: "No ticket found for this user and event" });
        }

        const ticketId = ticket[0].ticketId;

        // Delete the ticket
        await pool.query("DELETE FROM Tickets WHERE ticketId = ?", [ticketId]);

        // Increase the ticket count
        await pool.query("UPDATE Events SET totalTickets = totalTickets + 1 WHERE eventId = ?", [eventId]);

        res.json({ message: "Ticket unclaimed successfully", ticketId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});