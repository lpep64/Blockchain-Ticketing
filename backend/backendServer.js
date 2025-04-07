import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';  // Import the CORS middleware
import callWithFailover from './blockchain/nodeInterface.js'
import Web3 from 'web3'

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

function toBytes16(str) {
  const buf = Buffer.alloc(16); // Create a 16-byte buffer filled with 0x00
  const strBytes = Buffer.from(str, 'utf8'); // Convert string to bytes
  strBytes.copy(buf, 16 - strBytes.length); // Copy bytes to the end
  return buf;
}

// 3️⃣ Claim a Ticket
app.post('/claimticket', async (req, res) => {
  try {
      const eventId = req.body.eventID;
      const netID = req.body.netID;
      console.log(eventId);
      console.log(netID);
      const seatInfo = toBytes16('GA');
      // Step 1: Check ticket availability
      const [event] = await pool.query("SELECT totalTickets FROM events WHERE eventId = ?", [eventId]);

      if (event.length === 0) {
          return res.status(404).json({ error: "Event not found" });
      }
      if (event[0].totalTickets <= 0) {
          return res.status(400).json({ error: "No tickets available" });
      }
      //blockchain portion
      const hashedNetID = Web3.utils.keccak256(netID);
      const tickets = await callWithFailover('getTicketsByNetID', hashedNetID);
      for(let i = 0; i < tickets.length; i++){
        if(eventId == tickets[i].eventId){
          throw new Error("you already have a ticket for this event");
        }
      }
      await callWithFailover('generateTicket', hashedNetID, eventId, seatInfo);  // Call the backend function

      // Step 2: Update events table (decrement totalTickets)
      await pool.query("UPDATE events SET totalTickets = totalTickets - 1 WHERE eventId = ?", [eventId]);

      res.status(200).json({ message: "Ticket claimed successfully"});

  } catch (error) {
      console.error("Error claiming ticket:", error);
      res.status(500).json({ error: `Internal server error: ${error.message}`, details: error.message });
  }
});


//View Wallet
app.get('/getWallet', async (req, res) => {
  try{
    const netID = req.query.netID || req.headers.netID;
    const hashedNetID = Web3.utils.keccak256(netID);
    const rawTickets = await callWithFailover('getTicketsByNetID', hashedNetID);
    let tickets = [];
    for(let i = 0; i < rawTickets.length; i++){
      if(rawTickets[i].isValidated == false){
        const QRCode = String(rawTickets[i].id) + "$$$" + hashedNetID;
        const [event] = await pool.query("SELECT * FROM events WHERE eventId = ?", [Number(rawTickets[i].eventId)]);
        console.log(event);
        const newTicket = {
          eventID: Number(rawTickets[i].eventId),
          title: event[0].eventName,
          date: event[0].eventDate,
          QRCode: QRCode
        }
        tickets.push(newTicket);
      }
    }
    console.log(tickets)
    res.json(tickets);

  }catch (error){
    console.error("Error viewing wallet:", error);
    res.status(500).json({ error: `Internal server error: ${error.message}`, details: error.message });
  }
})


//4️⃣ Unclaim a Ticket
app.post('/unclaimticket', async (req, res) => {
  const { eventId } = req.body;
  try {
    const eventId = req.body.eventID;
    const netID = req.body.netID;
    const hashedNetID = Web3.utils.keccak256(netID);
    // Check if event exists
    const [event] = await pool.query("SELECT eventId FROM events WHERE eventId = ?", [eventId]);
    
    if (event.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    await callWithFailover('unclaimTicket', hashedNetID, eventId);

    // Update events table (increment totalTickets)
    await pool.query("UPDATE events SET totalTickets = totalTickets + 1 WHERE eventId = ?", [eventId]);

    res.status(200).json({ message: "Ticket unclaimed successfully" });
  } catch (error) {
    console.error("Error unclaiming ticket:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});