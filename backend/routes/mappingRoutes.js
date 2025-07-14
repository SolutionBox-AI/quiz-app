// routes/mappingRoutes.js
const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Mapping = require("../models/Mapping");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("mapping"), async (req, res) => {
  const results = [];

  try {
    const stream = fs.createReadStream(req.file.path)
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
        fs.unlinkSync(req.file.path); // Clean temp file

        if (!results.length) {
          return res.status(400).json({ success: false, message: "CSV parsed but no valid data" });
        }

        try {
          await Mapping.deleteMany(); // Optional
          await Mapping.insertMany(results);
          res.json({ success: true, message: "✅ Mapping uploaded successfully!" });
        } catch (err) {
          console.error("❌ Error saving mappings:", err);
          res.status(500).json({ success: false, message: "❌ Failed to save mappings." });
        }
      });
  } catch (err) {
    console.error("❌ CSV upload failed:", err);
    res.status(500).json({ success: false, message: "❌ CSV upload error." });
  }
});

module.exports = router;
