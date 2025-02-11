const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());  // Middleware for parsing JSON

// Routes
app.use('/api/students', require('./routes/tickets')); // Add student routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));