import express from 'express';
import cors from 'cors';

// Create an instance of the app
const app = express();

app.use(cors());
app.use(express.json());

// Routes
import ticketRoutes from './routes/tickets.js';
app.use('/api/tickets', ticketRoutes); // This creates the /api/tickets path

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));