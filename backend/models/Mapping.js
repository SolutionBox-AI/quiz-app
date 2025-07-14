// models/Mapping.js
const mongoose = require("mongoose");

const mappingSchema = new mongoose.Schema({
  adminEmail: String,
  studentName: String,
  studentCode: String,
});

module.exports = mongoose.model("Mapping", mappingSchema);


