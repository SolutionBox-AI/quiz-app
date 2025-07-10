const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Mongoose Models
const Question = require('../models/Question');
const Response = require('../models/Response');

// Get all test names (distinct testIds)
router.get('/tests', async (req, res) => {
  try {
    const testIds = await Question.distinct('testId');
    res.json(testIds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

// Get all questions for a specific test
router.get('/test/:testId/questions', async (req, res) => {
  const testId = req.params.testId;

  try {
    const questions = await Question.find({ testId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

// Save a full test (admin creating it)
router.post('/test/:testId/save', async (req, res) => {
  const testId = req.params.testId;
  const questions = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Invalid question data' });
  }

  try {
    // Remove old questions of same testId before saving new ones
    await Question.deleteMany({ testId });

    // Save each question
    const questionDocs = questions.map(q => ({ ...q, testId }));
    await Question.insertMany(questionDocs);

    res.json({ message: 'Test saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save test' });
  }
});

// Submit quiz response
router.post('/test/:testId/submit', async (req, res) => {
  const testId = req.params.testId;
  const submission = req.body;

  if (!submission || !submission.name || !submission.answers) {
    return res.status(400).json({ error: 'Incomplete submission' });
  }

  try {
    await Response.create({
      ...submission,
      testId,
      submittedAt: new Date()
    });

    res.json({ message: 'Response saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save response' });
  }
});

// Get all responses for a specific test (for admin view/download)
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
