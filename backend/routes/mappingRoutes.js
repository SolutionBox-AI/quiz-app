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
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        if (data.adminEmail && data.studentName && data.studentCode) {
          results.push({
            adminEmail: data.adminEmail.trim(),
            studentName: data.studentName.trim(),
            studentCode: data.studentCode.trim(),
          });
        }
      })
      .on("end", async () => {
        try {
          if (!results.length) throw new Error("CSV parsed but no valid data");
          await Mapping.deleteMany({});
          await Mapping.insertMany(results);
          fs.unlinkSync(req.file.path);
          res.json({ success: true, message: "✅ Mapping uploaded successfully!" });
        } catch (err) {
          console.error("❌ Error saving mappings:", err);
          res.status(500).json({ success: false, message: "❌ Error saving mappings to database." });
        }
      });
  } catch (err) {
    console.error("❌ CSV Parsing Failed:", err);
    res.status(500).json({ success: false, message: "❌ CSV parsing failed." });
  }
});

router.get("/all", async (req, res) => {
  try {
    const mappings = await Mapping.find();
    res.json(mappings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch mappings" });
  }
});

module.exports = router;
