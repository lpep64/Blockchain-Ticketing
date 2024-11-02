import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'vue-app/dist')));

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`); 
});

// Route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'vue-app/dist/index.html'));
});

// Serve the Vue application for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'vue-app/dist/index.html'));
});
