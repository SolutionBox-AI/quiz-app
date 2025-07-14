const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const quizRoutes = require("./routes/quizRoutes");
const mappingRoutes = require("./routes/mappingRoutes");

dotenv.config(); // ✅ Load .env variables

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Fallback Mongo URL if env variable is missing
const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://SolutionBox:9829004187%40Ba@quiz-appdb.0j3x50l.mongodb.net/quizdb?retryWrites=true&w=majority&appName=quiz-app";

console.log("MONGO_URL being used:", MONGO_URL); // ✅ For debug

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/quiz", quizRoutes);
app.use("/api/mapping", mappingRoutes);

// Connect to MongoDB
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
