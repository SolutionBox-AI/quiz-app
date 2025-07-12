const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  testId: String,
  name: String,
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

