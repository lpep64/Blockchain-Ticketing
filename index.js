import express from "express";
import axios from "axios";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
// import db from "./backend/database/databaseConnector.js";
import Web3 from 'web3'
import callWithFailover from './backend/blockchain/nodeInterface.js'
import events from './defaultEvents.js'
import blockTicketToRealTicket from './backend/blockchain/convertBCTicket.js'


const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cookieParser());

//Get netID from the cookie
app.get("/api/getNetID", (req, res) => {
  try{
    console.log(req.cookies.netID);
    res.json({ netID: req.cookies.netID || null });
  } catch (error){
    console.log("error fetching netID throuh cookie", error);
    res.status(500).send('error fetching your netID');
  }
});


// API Route for getting events
// Need to have this query the databse
app.get("http://localhost:3001/api/getEvents", (req, res) => {
  console.log('getEventsAPICalled');
  try{
    console.log(req.body); //Here just fetch all the events from the DB, filtering is handled on the frontend
    const eventsCopy = events;
    res.json(eventsCopy);
  }catch (error) {
    console.log("error fetching events: ", error);
    res.status(500).send("error fetching events");
  }
});


// API Routes for ticket interaction
app.get("/api/ticketsByNetID", async (req, res) => {
  console.log('getTicketsAPICalled');
  try {
    const netID = req.query.netID || req.headers.netID;
    console.log("Received netID:", netID);
    const hashedNetID = Web3.utils.keccak256(netID);
    const rawTickets = await callWithFailover('getTicketsByNetID', hashedNetID);
    let tickets = [];
    for(let i = 0; i < rawTickets.length; i++){
      const newTicket = blockTicketToRealTicket(rawTickets[i].eventId, rawTickets[i].seatInfo, rawTickets[i].id, hashedNetID);
      tickets.push(newTicket);
    }
    // console.log(tickets);
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    // res.status(500).send("Error fetching tickets");
  }
});

// Helps covernt seatinfo to blockchain formating
function toBytes16(str) {
  const buf = Buffer.alloc(16); // Create a 16-byte buffer filled with 0x00
  const strBytes = Buffer.from(str, 'utf8'); // Convert string to bytes
  strBytes.copy(buf, 16 - strBytes.length); // Copy bytes to the end
  return buf;
}

// Claims a ticket
app.post("/api/claimTicket", async (req, res) => {
  console.log('generateAIPCalled');
  const netID = req.body.netID;
  const eventID = req.body.eventID;
  const seatInfo = toBytes16("GA");

  if (!netID || !eventID || !seatInfo) {
    return res.status(400).send("Missing parameters.");
  }

  try {
    const hashedNetID = Web3.utils.keccak256(netID);
    const tickets = await callWithFailover('getTicketsByNetID', hashedNetID);
    for(let i = 0; i < tickets.length; i++){
      if(eventID == tickets[i].eventId){
        return res.status(200).send("You already have a ticket for this event.");
      }
    }
    await callWithFailover('generateTicket', hashedNetID, eventID, seatInfo);  // Call the backend function
    res.status(200).send("Ticket claimed successfully.");
  } catch (error) {
    console.error("Error claiming ticket:", error);
    // res.status(500).json({ error: error.message || "Error claiming ticket" });
  }
});

app.post("/api/unclaimTicket", async (req, res) => {
  console.log('unclaimAPICalled');
  const netID = req.query.netID || req.headers.netID;
  const eventID = req.query.eventID || req.headers.eventID;
  try{
    const hashedNetID = Web3.utils.keccak256(netID);
    const recept = await callWithFailover('unclaimTicket', hashedNetID, eventID);
    res.status(200).send("Ticket unclaimed successfully");
  }catch (error) {
    console.log("Error unclaiming ticket: ", error);
  }
})



// API Route for transfering ticket
app.post("/api/transfer-ticket", (req, res) => {
  console.log('transferAPICalled')
  const SendernetID = req.body.SendernetID;
  const eventID = req.body.eventID;
  const ReceiverNetID = req.body.ReceiverNetID;

  if (!SendernetID || !ReceiverNetID) {
    return res.status(400).send("Missing parameters.");
  }

  try {
    const hashedSenderNetID = Web3.utils.keccak256(SendernetID);
    const hashedReceiverNetID = Web3.utils.keccak256(ReceiverNetID);
    callWithFailover('transferTicket', hashedSenderNetID, hashedReceiverNetID, eventID);  // Call the backend function
    res.status(200).send("Ticket transfered successfully.");
  } catch (error) {
    console.error("Error generating ticket:", error);
    res.status(500).send("Error generating ticket.");
  }
});
// CAS
const UCONN_CAS = "https://login.uconn.edu/cas";
const SERVICE_URL = process.env.SERVICE_URL || `http://localhost:${PORT}/login/callback`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "vue-app/dist")));

function requireAuth(req, res, next) {
  const netID = req.cookies.netID; 
  if (netID) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/login", (req, res) => {
  const loginUrl = `${UCONN_CAS}/login?service=${encodeURIComponent(SERVICE_URL)}`;
  res.redirect(loginUrl);
});

app.get("/login/callback", async (req, res) => {
  const ticket = req.query.ticket;
  try {
    const validateUrl = `${UCONN_CAS}/serviceValidate?service=${encodeURIComponent(SERVICE_URL)}&ticket=${ticket}`;
    const response = await axios.get(validateUrl, { responseType: "text" });

    const userMatch = response.data.match(/<cas:user>(.*?)<\/cas:user>/);

    // Auth Cookie Portion
    if (userMatch) {
      const netID = userMatch[1];
      res.cookie("netID", netID);
      res.redirect("/");
    } else {
      res.redirect("/");
    } 

    // Database portion
    /*
    const netID = userMatch[1];
    console.log(userMatch);
    
    const [items] = await db.execute("SELECT netID FROM users WHERE netID = ?", [netID]);

    if (items.length > 0) {
      console.log("ALREADY INSERTED");
      res.cookie("netID", netID);
      res.redirect("/");
    } else {
      await db.execute("INSERT INTO users (netID) VALUES (?)", [netID]);
      console.log("NEW INSERTED");
      res.cookie("netID", netID);
    }
    */
  
  }catch (error) {
    console.error("Error validating ticket:", error);
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("netID");
  const logoutUrl = `${UCONN_CAS}/logout?service=${encodeURIComponent(process.env.SERVICE_URL || `http://localhost:${PORT}`)}`;
  res.redirect(logoutUrl);
});



app.get("*", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "vue-app/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));