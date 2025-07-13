// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true }, // For admins
  password: String, // Hashed
  role: { type: String, enum: ["admin", "student"], required: true },
  name: String, // Display name
  userCode: String, // For students only, acts as login ID
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // If student, their admin
  linkedStudents: [String] // For admins, list of student userCodes
});

module.exports = mongoose.model("User", userSchema);

