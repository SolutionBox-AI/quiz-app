// routes/quizRoutes.js
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const Response = require("../models/Response");
const Mapping = require("../models/Mapping");

// ✅ Get all test IDs (for admin use)
router.get("/tests", async (req, res) => {
  try {
    const testIds = await Question.distinct("testId");
    res.json(testIds);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch test list" });
  }
});

// ✅ Get questions for a specific test
router.get("/test/:testId/questions", async (req, res) => {
  try {
    const questions = await Question.find({ testId: req.params.testId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// ✅ Save or update test questions
router.post("/test/:testId/save", async (req, res) => {
  const testId = req.params.testId;
  const raw = req.body;
  const questions = Array.isArray(raw) ? raw : raw.questions;
  const createdBy = raw.teacherEmail || questions[0]?.teacherEmail;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Invalid questions data" });
  }

  try {
    await Question.deleteMany({ testId });
    await Question.insertMany(questions.map(q => ({
      ...q,
      testId,
      createdBy
    })));
    res.json({ message: "Test saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save test" });
  }
});

// ✅ Submit quiz response
router.post("/test/:testId/submit", async (req, res) => {
  const { testId } = req.params;
  const { name, userCode, answers } = req.body;

  if (!name || !userCode || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Invalid submission data" });
  }

  try {
    const saved = await Response.create({ testId, name, userCode, answers });
    res.status(200).json({ success: true, message: "Response saved", data: saved });
  } catch (err) {
    res.status(500).json({ error: "Failed to save response" });
  }
});

// ✅ Get all responses for a test
router.get("/test/:testId/responses", async (req, res) => {
  try {
    const responses = await Response.find({ testId: req.params.testId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch responses" });
  }
});

// ✅ Get test list for a particular student (based on teacher-student mapping)
router.get("/test-list-for-student", async (req, res) => {
  const { name, userCode } = req.query;

  if (!name || !userCode) {
    return res.status(400).json({ error: "Name and userCode are required" });
  }

  try {
    // Find all admins mapped to this student
    const mappings = await Mapping.find({ studentName: name, studentCode: userCode });
    const allowedAdmins = mappings.map(m => m.adminEmail);

    // Fetch tests created by those admins
    const tests = await Question.distinct("testId", { createdBy: { $in: allowedAdmins } });
    res.json(tests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tests for student" });
  }
});

module.exports = router;
