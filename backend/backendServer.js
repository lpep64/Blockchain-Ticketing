import express from 'express';
import db from './database/databaseConnector.js';

const app = express();
const PORT = process.env.PORT || 9090;

app.get('/', (req, res) => {
   res.send('This is backend server on 9090');
});

app.get('/seeAllUsers', async (req, res) => {
  try {
    const [items] = await db.execute("SELECT * FROM Users");
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve items" });
  }
});
app.get('/checkdb', (req, res) => {
  try {
    const dbInfo = {
      host: db.connection.config.host, 
      user: db.connection.config.user,
      database: db.connection.config.database
    };
    res.json(dbInfo);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve database parameters" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
