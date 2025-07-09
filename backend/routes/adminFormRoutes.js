const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const TESTS_DIR = path.join(__dirname, '../uploads/tests');
const RESPONSES_DIR = path.join(__dirname, '../uploads/responses');

// Ensure directories exist
if (!fs.existsSync(TESTS_DIR)) fs.mkdirSync(TESTS_DIR, { recursive: true });
if (!fs.existsSync(RESPONSES_DIR)) fs.mkdirSync(RESPONSES_DIR, { recursive: true });

// 📄 Get all test filenames
router.get('/tests', (req, res) => {
  fs.readdir(TESTS_DIR, (err, files) => {
    if (err) return res.status(500).send("Unable to read test directory");
    res.json(files.filter(f => f.endsWith('.json')));
  });
});

// ➕ Upload/Create a new test
router.post('/create-test', (req, res) => {
  const { name, content } = req.body;

  if (!name || !content) return res.status(400).send({ message: "Missing name or content" });

  const filePath = path.join(TESTS_DIR, `${name}.json`);

  fs.writeFile(filePath, content, err => {
    if (err) return res.status(500).send({ message: "Failed to save test" });
    res.send({ message: "Test saved successfully" });
  });
});

// 📤 Get questions for a test
router.get('/test/:testId', (req, res) => {
  const testPath = path.join(TESTS_DIR, req.params.testId);
  if (!fs.existsSync(testPath)) return res.status(404).send("Test not found");

  fs.readFile(testPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send("Error reading test file");
    res.send(JSON.parse(data));
  });
});

// ✅ Submit response for a test
router.post('/test/:testId/submit', (req, res) => {
  const testId = req.params.testId;
  const filePath = path.join(RESPONSES_DIR, `${testId}-responses.json`);
  const response = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    let responses = [];
    if (!err && data) {
      try {
        responses = JSON.parse(data);
      } catch (e) {
        responses = [];
      }
    }

    response.timestamp = new Date().toISOString();
    responses.push(response);

    fs.writeFile(filePath, JSON.stringify(responses, null, 2), err => {
      if (err) return res.status(500).send("Failed to save response");
      res.send({ message: "Response submitted successfully" });
    });
  });
});

// 📥 Download all responses for a test
router.get('/test/:testId/responses', (req, res) => {
  const filePath = path.join(RESPONSES_DIR, `${req.params.testId}-responses.json`);

  if (!fs.existsSync(filePath)) return res.status(404).send("Responses not found");

  res.download(filePath);
});

module.exports = router;
