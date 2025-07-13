const mongoose = require("mongoose");

const AdminStudentMapSchema = new mongoose.Schema({
  adminEmail: { type: String, required: true },
  adminName: { type: String, required: true },
  studentCode: { type: String, required: true },
  studentName: { type: String, required: true }
});

module.exports = mongoose.model("AdminStudentMap", AdminStudentMapSchema);

