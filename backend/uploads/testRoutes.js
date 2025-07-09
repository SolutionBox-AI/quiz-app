const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Get list of all tests
router.get('/tests', (req, res) => {
  const dir = path.join(__dirname, '../uploads/tests');
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).send("Failed to read test list");
    const tests = files.filter(file => file.endsWith('.json'));
    res.json(tests);
  });
});

// Get specific test content
router.get('/test/:testId', (req, res) => {
  const filePath = path.join(__dirname, `../uploads/tests/${req.params.testId}`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).send("Test not found");
    res.json(JSON.parse(data));
  });
});

// Submit response to specific test
router.post('/test/:testId/submit', (req, res) => {
  const newResponse = req.body;
  const fileName = req.params.testId.replace('.json', '') + '-responses.json';
  const responseFile = path.join(__dirname, `../uploads/responses/${fileName}`);

  fs.readFile(responseFile, 'utf8', (err, data) => {
    let responses = [];
    if (!err && data) {
      try {
        responses = JSON.parse(data);
      } catch {
        responses = [];
      }
    }

    newResponse.timestamp = new Date().toISOString(); // log time
    responses.push(newResponse);

    fs.writeFile(responseFile, JSON.stringify(responses, null, 2), err => {
      if (err) return res.status(500).send("Failed to save response");
      res.send({ message: "Response saved successfully" });
    });
  });
});

module.exports = router;
