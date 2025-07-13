const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const AdminStudentMap = require("../models/AdminStudentMap");

// Multer config
const upload = multer({ dest: "uploads/" });

// POST: Upload CSV and save mappings
router.post("/upload-mapping", upload.single("mappingFile"), async (req, res) => {
  const filePath = req.file.path;
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      // Expecting columns: adminEmail, adminName, studentCode, studentName
      if (data.adminEmail && data.studentCode) {
        results.push({
          adminEmail: data.adminEmail,
          adminName: data.adminName || "",
          studentCode: data.studentCode,
          studentName: data.studentName || ""
        });
      }
    })
    .on("end", async () => {
      try {
        await AdminStudentMap.insertMany(results);
        fs.unlinkSync(filePath); // remove uploaded file
        res.json({ message: "✅ Mapping uploaded successfully", count: results.length });
      } catch (err) {
        res.status(500).json({ error: "❌ Failed to save mappings" });
      }
    });
});

module.exports = router;

