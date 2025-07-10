const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const uploadsPath = path.join(__dirname, '../uploads');

// ✅ 1. Get list of all test IDs (folders with questions.json)
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

// ✅ 2. Get questions for a specific test
router.get('/test/:testId/questions', (req, res) => {
  const testId = req.params.testId;
  const questionsPath = path.join(uploadsPath, testId, 'questions.json');

  fs.readFile(questionsPath, 'utf8', (err, data) => {
    if (err) return res.status(404).send({ error: 'Questions not found for this test' });

    try {
      const questions = JSON.parse(data);
      res.send(questions);
    } catch (e) {
      res.status(500).send({ error: 'Invalid JSON in questions file' });
    }
  });
});

// ✅ 3. Save full test paper (admin adds questions in bulk)
router.post('/test/:testId/save', (req, res) => {
  const testId = req.params.testId;
  const questions = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).send({ error: 'Invalid question data' });
  }

  const testFolderPath = path.join(uploadsPath, testId);
  const questionsPath = path.join(testFolderPath, 'questions.json');

  fs.mkdir(testFolderPath, { recursive: true }, (err) => {
    if (err) return res.status(500).send({ error: 'Could not create test folder' });

    fs.writeFile(questionsPath, JSON.stringify(questions, null, 2), (err) => {
      if (err) return res.status(500).send({ error: 'Failed to save questions' });
      res.send({ message: 'Test saved successfully' });
    });
  });
});

// ✅ 4. Submit answers (student side)
// Submit and score answers
router.post('/test/:testId/submit', (req, res) => {
  const testId = req.params.testId;
  const submission = req.body;

  const questionsPath = path.join(__dirname, '../uploads', testId, 'questions.json');
  const responsesPath = path.join(__dirname, '../uploads', testId, 'responses.json');

  fs.readFile(questionsPath, 'utf8', (err, questionData) => {
    if (err) return res.status(404).send({ error: 'Test questions not found' });

    let questions;
    try {
      questions = JSON.parse(questionData);
    } catch {
      return res.status(500).send({ error: 'Invalid questions format' });
    }

    // Calculate score
    let score = 0;
    submission.answers.forEach((ans, idx) => {
      if (questions[idx] && questions[idx].correct === ans) {
        score++;
      }
    });

    const newResponse = {
      name: submission.name,
      town: submission.town,
      code: submission.code,
      answers: submission.answers,
      score,
      submittedAt: new Date().toISOString()
    };

    fs.readFile(responsesPath, 'utf8', (err, data) => {
      let responses = [];
      if (!err && data) {
        try { responses = JSON.parse(data); } catch { }
      }

      responses.push(newResponse);

      fs.writeFile(responsesPath, JSON.stringify(responses, null, 2), (err) => {
        if (err) return res.status(500).send({ error: 'Could not save response' });
        res.send({ message: 'Response saved successfully', score });
      });
    });
  });
});

module.exports = router;
