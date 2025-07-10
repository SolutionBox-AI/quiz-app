const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  label: String,
  text: String
});

const questionSchema = new mongoose.Schema({
  testId: String,
  question: String,
  options: [optionSchema]
});

module.exports = mongoose.model('Question', questionSchema);

