const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET all questions for a given testId
router.get('/:testId', async (req, res) => {
  try {
    const questions = await Question.find({ testId: req.params.testId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// POST a new question
router.post('/', async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.json({ message: 'Question added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add question' });
  }
});

module.exports = router;

