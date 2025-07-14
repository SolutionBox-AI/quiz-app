const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const quizRoutes = require("./routes/quizRoutes");
const mappingRoutes = require("./routes/mappingRoutes");

app.use("/api/quiz", quizRoutes);
app.use("/api/mapping", mappingRoutes);

// ✅ Root route for testing Render deployment
app.get("/", (req, res) => {
  res.send("✅ Quiz API is running!");
});

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 10000;

if (!MONGO_URI) {
  console.error("❌ MONGO_URL not found in environment variables.");
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});
