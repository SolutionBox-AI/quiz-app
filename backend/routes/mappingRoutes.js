const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Mapping = require("../models/Mapping");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("mapping"), async (req, res) => {
  const results = [];

  if (!req.file) {
    return res.status(400).json({ success: false, message: "❌ No file uploaded." });
  }

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      console.log("Raw Row ➜", row);
      const { adminEmail, studentName, studentCode } = row;

      if (adminEmail && studentName && studentCode) {
        results.push({
          adminEmail: adminEmail.trim(),
          studentName: studentName.trim(),
          studentCode: studentCode.trim()
        });
      }
    })
    .on("end", async () => {
      fs.unlinkSync(req.file.path); // Clean temp file

      if (results.length === 0) {
        return res.status(400).json({ success: false, message: "❌ CSV parsed but no valid data." });
      }

      try {
        console.log("📥 Inserting data into DB:", results);

        const inserted = await Mapping.insertMany(results);
        console.log("✅ Mappings inserted:", inserted);

        res.json({ success: true, message: "✅ Mapping uploaded successfully!" });
      } catch (err) {
        console.error("❌ Error inserting into DB:", err);
        res.status(500).json({ success: false, message: "❌ Error saving mappings to DB." });
      }
    })
    .on("error", (err) => {
      console.error("❌ CSV parsing error:", err);
      res.status(500).json({ success: false, message: "❌ Error parsing CSV." });
    });
});

router.get("/all", async (req, res) => {
  try {
    const mappings = await Mapping.find();
    res.json(mappings);
  } catch (err) {
    console.error("❌ Error fetching mappings:", err);
    res.status(500).json({ error: "Failed to fetch mappings" });
  }
});

module.exports = router;
