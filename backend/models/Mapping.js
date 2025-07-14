const mongoose = require("mongoose");

const mappingSchema = new mongoose.Schema({
  adminEmail: { type: String, required: true },
  studentName: { type: String, required: true },
  studentCode: { type: String, required: true }
});

module.exports = mongoose.model("Mapping", mappingSchema);


