import express from "express";
import axios from "axios";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
// import getNodeInfo from './backend/blockchain/getNodeInfo.js'
import callWithFailover from './backend/blockchain/nodeInterface.js'

// Get node info before anything else
// await getNodeInfo();


const app = express();
const PORT = process.env.PORT || 8080;

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

// API Routes for ticket interaction
app.post("/api/generate-ticket", (req, res) => {
  console.log('generateAIPCalled');
  const { netID, eventID, seatInfo } = req.body;  // Destructure from the request body

  if (!netID || !eventID || !seatInfo) {
    return res.status(400).send("Missing parameters.");
  }

  try {
    const hashedNetID = Web3.utils.keccak256(netid.value);
    callWithFailover('generateTicket', hashedNetID, eventID, seatInfo);  // Call the backend function
    res.status(200).send("Ticket generated successfully.");
  } catch (error) {
    console.error("Error generating ticket:", error);
    res.status(500).send("Error generating ticket.");
  }
});

// API Route for transfering ticket
app.post("/api/transfer-ticket", (req, res) => {
  const { SendernetID, ReceiverNetID, eventID } = req.body;  // Destructure from the request body

  if (!SendernetID || !ReceiverNetID || !eventID) {
    return res.status(400).send("Missing parameters.");
  }

  try {
    const hashedSenderNetID = Web3.utils.keccak256(netid.value);
    const hashedReceiverNetID = Web3.utils.keccak256(netid.value);
    callWithFailover('transferTicket', hashedSenderNetID, hashedReceiverNetID, eventID);  // Call the backend function
    res.status(200).send("Ticket generated successfully.");
  } catch (error) {
    console.error("Error generating ticket:", error);
    res.status(500).send("Error generating ticket.");
  }
});

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
    if (userMatch) {
      const netID = userMatch[1];
      res.cookie("netID", netID);
      res.redirect("/");
    } else {
      res.status(401).send("CAS authentication failed.");
    }
  } catch (error) {
    console.error("Error validating ticket:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("netID");
  const logoutUrl = `${UCONN_CAS}/logout?service=${encodeURIComponent(process.env.SERVICE_URL || "http://localhost:8080")}`;
  res.redirect(logoutUrl);
});

app.get("*", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "vue-app/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});