// routes/mappingRoutes.js
const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Mapping = require("../models/Mapping");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// 🔁 Upload CSV and save admin-student mapping
router.post("/upload", upload.single("mapping"), async (req, res) => {
  const results = [];

  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      console.log("Raw Row ➜", data); // 👈 log each row to debug

      // Normalize keys to prevent BOM or whitespace issues
      const cleaned = {};
      for (const key in data) {
        const cleanKey = key.trim().replace(/\uFEFF/g, ""); // remove BOM
        cleaned[cleanKey] = data[key].trim();
      }

      if (cleaned.adminEmail && cleaned.studentName && cleaned.studentCode) {
        results.push({
          adminEmail: cleaned.adminEmail,
          studentName: cleaned.studentName,
          studentCode: cleaned.studentCode,
        });
      }
    })
    .on("end", async () => {
      try {
        if (results.length === 0) {
          console.log("❌ No valid rows found in CSV.");
          return res
            .status(400)
            .json({ success: false, message: "CSV parsed but no valid data" });
        }

        await Mapping.deleteMany({});
        await Mapping.insertMany(results);
        fs.unlinkSync(filePath);
        res.json({ success: true, message: "✅ Mapping uploaded successfully!" });
      } catch (err) {
        console.error("❌ Error saving mappings:", err);
        res.status(500).json({
          success: false,
          message: "❌ Error saving mappings to database.",
        });
      }
    });
});

module.exports = router;
