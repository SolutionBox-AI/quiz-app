const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  name: String,
  town: String,
  code: String,
  testId: String,
  answers: [String],
  submittedAt: Date
});

module.exports = mongoose.model('Response', responseSchema);

