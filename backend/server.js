// TODO: Deploy this to a Google Cloud instance (Google Cloud Run, Compute Engine, or App Engine)

const express = require('express');
const connectDB = require('./db');
const studentRoutes = require('./routes/studentRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/students', studentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});