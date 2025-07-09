const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const uploadsPath = path.join(__dirname, '../uploads');




// Get list of tests (folders/files in uploads)
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

module.exports = router;
// Get questions for a specific test
router.get('/test/:testId/questions', (req, res) => {
  const testId = req.params.testId;
  const questionsPath = path.join(__dirname, '../uploads', testId, 'questions.json');

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

// Submit answers for a specific test
router.post('/test/:testId/submit', (req, res) => {
  const testId = req.params.testId;
  const submission = req.body;
  const testFolder = path.join(__dirname, '../uploads', testId);
  const responsesPath = path.join(testFolder, 'responses.json');

  fs.mkdir(testFolder, { recursive: true }, (err) => {
    if (err) return res.status(500).send({ error: 'Could not create test folder' });

    fs.readFile(responsesPath, 'utf8', (err, data) => {
      let responses = [];
      if (!err && data) {
        try {
          responses = JSON.parse(data);
        } catch (e) {
          responses = [];
        }
      }

      responses.push({
        ...submission,
        submittedAt: new Date().toISOString()
      });

      fs.writeFile(responsesPath, JSON.stringify(responses, null, 2), (err) => {
        if (err) return res.status(500).send({ error: 'Could not save response' });
        res.send({ message: 'Response saved successfully' });
      });
    });
  });
});

module.exports = router;
