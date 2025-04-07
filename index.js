import express from "express";
import axios from "axios";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
// import db from "./backend/database/databaseConnector.js";
import Web3 from 'web3'
import callWithFailover from './backend/blockchain/nodeInterface.js'
import cors from 'cors'


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

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));