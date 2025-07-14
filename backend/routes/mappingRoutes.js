// routes/mappingRoutes.js
const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Mapping = require("../models/Mapping");

const router = express.Router();

// Configure multer for temporary upload folder
const upload = multer({ dest: "uploads/" });

// 🔁 Upload CSV and save admin-student mapping
router.post("/upload", upload.single("mapping"), async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      if (data.adminEmail && data.studentName && data.studentCode) {
        results.push({
          adminEmail: data.adminEmail.trim(),
          studentName: data.studentName.trim(),
          studentCode: data.studentCode.trim()
        });
      }
    })
    .on("end", async () => {
      try {
        await Mapping.deleteMany({}); // Optional: clear old mappings
        await Mapping.insertMany(results);
        fs.unlinkSync(req.file.path); // Clean up uploaded file
        res.json({ success: true, message: "✅ Mapping uploaded successfully!" });
      } catch (err) {
        console.error("❌ Error saving mappings:", err);
        res.status(500).json({ success: false, message: "❌ Error saving mappings to database." });
      }
    });
});

// 🔍 Get all mappings (for admin view)
router.get("/all", async (req, res) => {
  try {
    const allMappings = await Mapping.find();
    res.json(allMappings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch mappings" });
  }
});


module.exports = router;
