import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the Vue app
app.use(express.static(path.join(__dirname, 'vue-app/dist')));

// Handle SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'vue-app/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
