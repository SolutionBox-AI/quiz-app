const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  testId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Question', questionSchema);
