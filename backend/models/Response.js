const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  testId: { type: String, required: true },
  name: { type: String, required: true },
  answers: [
    {
      question: String,
      selected: String
    }
  ],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Response", responseSchema);
