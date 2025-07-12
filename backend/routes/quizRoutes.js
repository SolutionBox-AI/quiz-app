const express = require("express");
const router = express.Router();

const Question = require("../models/Question");
const Response = require("../models/Response");

// GET all test IDs
router.get("/tests", async (req, res) => {
  try {
    const testIds = await Question.distinct("testId");
    res.json(testIds);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch test list" });
  }
});

// GET all questions for a test
router.get("/test/:testId/questions", async (req, res) => {
  try {
    const questions = await Question.find({ testId: req.params.testId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// POST: Save questions for a test (admin)
router.post("/test/:testId/save", async (req, res) => {
  const testId = req.params.testId;
  const raw = req.body;
  const questions = Array.isArray(raw) ? raw : raw.questions;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Invalid questions data" });
  }

  try {
    await Question.deleteMany({ testId });
    await Question.insertMany(questions.map(q => ({ ...q, testId })));
    res.json({ message: "Test saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save test" });
  }
});

// POST: Submit a student's response
// POST: Submit a student's response
router.post("/test/:testId/submit", async (req, res) => {
  const { testId } = req.params;
  const { name, userCode, answers } = req.body;
  const existing = await Response.findOne({ testId, userCode });

if (existing) {
  return res.status(400).json({ error: "You have already submitted this test." });
}

  if (!name || !userCode || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const saved = await Response.create({ testId, name, userCode, answers });
    res.status(200).json({ message: "Response saved", data: saved });
  } catch (err) {
    res.status(500).json({ error: "Failed to save response" });
  }
});


// GET: All responses for a test (admin)
router.get("/test/:testId/responses", async (req, res) => {
  try {
    const responses = await Response.find({ testId: req.params.testId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch responses" });
  }
});

module.exports = router;
