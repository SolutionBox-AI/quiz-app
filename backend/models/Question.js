const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  testId: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  createdBy: { type: String, required: true } // Admin email
});

module.exports = mongoose.model("Question", questionSchema);
