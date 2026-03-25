require('dotenv').config({ path: '.env.local' });

const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/feedback', async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required.' });
  }

  try {
    await pool.query(
      'INSERT INTO feedback (name, message) VALUES ($1, $2)',
      [name, message]
    );

    res.json({ success: true, message: 'Feedback saved successfully.' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to save feedback.' });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
