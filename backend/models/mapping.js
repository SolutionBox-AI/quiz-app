// models/Mapping.js
const mongoose = require("mongoose");

const mappingSchema = new mongoose.Schema({
  adminCode: String,
  studentCode: String,
  adminName: String,
  studentName: String
});

module.exports = mongoose.model("Mapping", mappingSchema);

