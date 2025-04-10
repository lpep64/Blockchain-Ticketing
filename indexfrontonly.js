import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import axios from 'axios';

const app = express();
const PORT = 8082;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UCONN_CAS = "https://login.uconn.edu/cas";
const SERVICE_URL = process.env.SERVICE_URL || `http://localhost:${PORT}/login/callback`;


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


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "vue-app/dist", "index.html"));
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});