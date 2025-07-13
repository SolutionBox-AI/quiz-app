// backend/routes/quizRoutes.js
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

// GET questions for a test
router.get("/test/:testId/questions", async (req, res) => {
  try {
    const questions = await Question.find({ testId: req.params.testId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// POST save quiz (admin)
router.post("/test/:testId/save", async (req, res) => {
  const testId = req.params.testId;
  const questions = Array.isArray(req.body) ? req.body : req.body.questions;

  if (!questions.length) return res.status(400).json({ error: "Invalid questions data" });

  try {
    await Question.deleteMany({ testId });
    await Question.insertMany(questions.map(q => ({ ...q, testId })));
    res.json({ message: "Test saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save test" });
  }
});

// POST submit quiz (student)
router.post("/test/:testId/submit", async (req, res) => {
  const { testId } = req.params;
  const { name, userCode, answers } = req.body;
  if (!name || !userCode || !Array.isArray(answers)) return res.status(400).json({ error: "Invalid data" });

  try {
    const saved = await Response.create({ testId, name, userCode, answers });
    res.json({ message: "Response saved", data: saved });
  } catch (err) {
    res.status(500).json({ error: "Failed to save response" });
  }
});

// GET responses (admin), with filter by userCode
router.get("/test/:testId/responses", async (req, res) => {
  try {
    const { userCode } = req.query;
    const query = { testId: req.params.testId };
    if (userCode) query.userCode = userCode;
    const data = await Response.find(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch responses" });
  }
});

module.exports = router;
