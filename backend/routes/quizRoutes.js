const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Models
const Question = require('../models/Question');
const Response = require('../models/Response');

// ✅ GET all test IDs
router.get('/tests', async (req, res) => {
  try {
    const testIds = await Question.distinct('testId');
    console.log('✅ /tests hit - Found testIds:', testIds);
    res.json(testIds);
  } catch (err) {
    console.error('❌ Error fetching testIds:', err);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

// ✅ GET all questions of a specific test
router.get('/test/:testId/questions', async (req, res) => {
  try {
    const questions = await Question.find({ testId: req.params.testId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

// ✅ POST - Save test questions (admin)

router.post('/test/:testId/save', async (req, res) => {
  const testId = req.params.testId;
  const questions = req.body;

  console.log("✅ Incoming test save request:", { testId, questions });

  if (!Array.isArray(questions) || questions.length === 0) {
    console.log("❌ Invalid or empty questions array");
    return res.status(400).json({ error: 'Invalid questions data' });
  }

  try {
    await Question.deleteMany({ testId });
    await Question.insertMany(questions.map(q => ({ ...q, testId })));
    console.log("✅ Test saved successfully");
    res.json({ message: 'Test saved successfully' });
  } catch (err) {
    console.error('❌ Save error:', err);
    res.status(500).json({ error: 'Failed to save test' });
  }
});






// ✅ POST - Submit student response
router.post('/test/:testId/submit', async (req, res) => {
  const { testId } = req.params;
  const { name, answers } = req.body;

  console.log("Incoming submission:", { testId, name, answers });

  if (!name || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const saved = await Response.create({ testId, name, answers });
    console.log("✅ Saved response:", saved);
    res.status(200).json({ message: 'Response saved', data: saved });
  } catch (err) {
    console.error('❌ Save error:', err); // See full error in Render logs
    res.status(500).json({ error: 'Failed to save response' });
  }
});




// ✅ GET responses for a test
router.get('/test/:testId/responses', async (req, res) => {
  try {
    const responses = await Response.find({ testId: req.params.testId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

module.exports = router;
