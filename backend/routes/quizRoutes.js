const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// === MONGOOSE MODELS ===

const QuestionSchema = new mongoose.Schema({
  testId: String,
  question: String,
  options: [{ label: String, text: String }],
  correctAnswer: String
});

const ResponseSchema = new mongoose.Schema({
  testId: String,
  name: String,
  town: String,
  code: String,
  answers: [String],
  submittedAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', QuestionSchema);
const Response = mongoose.model('Response', ResponseSchema);

// === ROUTES ===

// Get list of all test IDs
router.get('/tests', async (req, res) => {
  try {
    const testIds = await Question.distinct('testId');
    res.json(testIds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch test list' });
  }
});

// Get questions for a specific test
router.get('/test/:testId/questions', async (req, res) => {
  const testId = req.params.testId;

  try {
    const questions = await Question.find({ testId });
    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found' });
    }
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

// Save questions for a test
router.post('/test/:testId/save', async (req, res) => {
  const testId = req.params.testId;
  const questions = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Invalid question data' });
  }

  try {
    // Remove existing questions for this test
    await Question.deleteMany({ testId });

    // Add new ones
    const withTestId = questions.map(q => ({ ...q, testId }));
    await Question.insertMany(withTestId);

    res.json({ message: 'Test saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save questions' });
  }
});

// Submit quiz response
router.post('/test/:testId/submit', async (req, res) => {
  const testId = req.params.testId;
  const submission = req.body;

  if (!submission.name || !submission.town || !submission.code || !Array.isArray(submission.answers)) {
    return res.status(400).json({ error: 'Invalid submission data' });
  }

  try {
    await Response.create({ ...submission, testId });
    res.json({ message: 'Response saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save response' });
  }
});

// View all responses for a test
router.get('/test/:testId/responses', async (req, res) => {
  const testId = req.params.testId;

  try {
    const responses = await Response.find({ testId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

module.exports = router;
