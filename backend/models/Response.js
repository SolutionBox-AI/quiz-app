const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  testId: {
    type: String,
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Question'
      },
      selectedOption: {
        type: String,
        required: true,
      }
    }
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Response', responseSchema);
