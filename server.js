const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/feedback', (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required.' });
  }

  const feedback = {
    name,
    message,
    createdAt: new Date().toISOString()
  };

  const filePath = path.join(__dirname, 'feedback.json');

  let existing = [];
  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  existing.push(feedback);
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

  res.json({ success: true, message: 'Feedback saved successfully.' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
