// routes/mappingRoutes.js
const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Mapping = require("../models/Mapping");

const router = express.Router();

// Temporary storage for uploaded CSV files
const upload = multer({ dest: "uploads/" });

// POST /api/mapping/upload
router.post("/upload", upload.single("mapping"), async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        await Mapping.deleteMany({}); // Clear previous mappings if needed
        await Mapping.insertMany(results);
        fs.unlinkSync(req.file.path); // delete temp file
        res.json({ success: true, message: "Mapping uploaded successfully." });
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error saving mapping." });
      }
    });
});

module.exports = router;
