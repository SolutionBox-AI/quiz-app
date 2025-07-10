// routes/quizRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const uploadsPath = path.join(__dirname, '../uploads');

// 🚀 Get list of available tests (test folders with questions.json)
router.get('/tests', (req, res) => {
  fs.readdir(uploadsPath, (err, files) => {
    if (err) return res.status(500).send({ error: 'Failed to read test list' });

    const testFolders = files.filter(folder => {
      const filePath = path.join(uploadsPath, folder, 'questions.json');
      return fs.existsSync(filePath);
    });

    res.send(testFolders);
  });
});

// 🚀 Get questions for a specific test
router.get('/test/:testId/questions', (req, res) => {
  const testId = req.params.testId;
  const questionsPath = path.join(uploadsPath, testId, 'questions.json');

  fs.readFile(questionsPath, 'utf8', (err, data) => {
    if (err) return res.status(404).send({ error: 'Questions not found' });

    try {
      const questions = JSON.parse(data);
      res.send(questions);
    } catch (e) {
      res.status(500).send({ error: 'Invalid questions file format' });
    }
  });
});

// 🚀 Save test questions (Admin side)
// Save questions for a test
router.post('/test/:testId/save', (req, res) => {
  const testId = req.params.testId;
  const questions = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).send({ error: 'Invalid question data' });
  }

  const testFolderPath = path.join(__dirname, '../uploads', testId);
  const questionsPath = path.join(testFolderPath, 'questions.json');

  fs.mkdir(testFolderPath, { recursive: true }, (err) => {
    if (err) return res.status(500).send({ error: 'Could not create folder' });

    fs.writeFile(questionsPath, JSON.stringify(questions, null, 2), (err) => {
      if (err) return res.status(500).send({ error: 'Could not write file' });

      res.send({ message: '✅ Test saved successfully' });
    });
  });
});

module.exports = router;
