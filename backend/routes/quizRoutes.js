const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register a new user (admin or student)
router.post("/register", async (req, res) => {
  const { name, email, password, role, adminId } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered." });

    const newUser = new User({ name, email, password, role });

    if (role === "student" && adminId) {
      newUser.adminId = adminId;
      // Link student to admin
      await User.findByIdAndUpdate(adminId, { $push: { linkedStudents: newUser._id } });
    }

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password }); // Note: In production, use hashed passwords
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Get students for a specific admin
router.get("/admin/:adminId/students", async (req, res) => {
  try {
    const students = await User.find({ adminId: req.params.adminId, role: "student" });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

module.exports = router;
