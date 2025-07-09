const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const QUESTIONS_PATH = path.join(__dirname, 'uploads', 'questions.json');
const RESPONSES_PATH = path.join(__dirname, 'uploads', 'responses.json');

app.get('/api/questions', (req, res) => {
  fs.readFile(QUESTIONS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error loading questions');
    res.json(JSON.parse(data));
  });
});

app.post('/api/submit', (req, res) => {
  const newResponse = req.body;

  fs.readFile(RESPONSES_PATH, 'utf8', (err, data) => {
    let responses = [];
    if (!err && data) {
      responses = JSON.parse(data);
    }

    responses.push(newResponse);

    fs.writeFile(RESPONSES_PATH, JSON.stringify(responses, null, 2), err => {
      if (err) return res.status(500).send('Error saving response');
      res.send({ message: 'Response submitted' });
    });
  });
});

// const path = require('path');

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));