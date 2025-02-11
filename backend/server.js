import express from 'express';
import cors from 'cors';

// Create an instance of the app
const app = express();

app.use(cors());
app.use(express.json());  // Middleware for parsing JSON

// Routes
import studentRoutes from './routes/tickets.js'; // Use import for the route
app.use('/api/students', studentRoutes); // Add student routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));