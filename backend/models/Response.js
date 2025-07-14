const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: String,
  selected: String
}, { _id: false });

const responseSchema = new mongoose.Schema({
  testId: { type: String, required: true },
  name: { type: String, required: true },
  userCode: { type: String, required: true },
  answers: [answerSchema],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Response", responseSchema);


